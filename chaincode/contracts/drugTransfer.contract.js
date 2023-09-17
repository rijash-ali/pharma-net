'use strict';

import { Contract } from "fabric-contract-api";
import { DRUG_TRANSFER_CONTRACT_KEY, deriveDrugAssetKey, deriveDrugPurchaseAssetKey, pharmaNameSpaces } from "../utils/assetKeys";
import { ContractRepository } from "../repository";
import { PharmaNetOrgs, ShipmentStatus } from "../utils/enums";

export class DrugTransferContract extends Contract {
  constructor() {
    super(DRUG_TRANSFER_CONTRACT_KEY);
  }

  async createPO(ctx, buyerCRN, sellerCRN, drugName, quantity) {
    /** Role: Restricted to Distributor | Retailer */
    if ([PharmaNetOrgs.distributor, PharmaNetOrgs.retailer].includes(ctx.clientIdentity.getMSPID()))
      throw new Error("Only distributors or retailers are allowed to create purchase orders on pharma network!");

    const buyer = ContractRepository.getFirstAssetFromKeyPrefix(ctx, pharmaNameSpaces.commpanyAsset, buyerCRN);
    const seller = ContractRepository.getFirstAssetFromKeyPrefix(ctx, pharmaNameSpaces.commpanyAsset, sellerCRN);

    /**
     * Validation:
     * The transfer of drug should take place in a hierarchical manner
     * and no organisation in the middle is skipped. 
     * For example, you need to make sure that a retailer is able to purchase drugs only from a distributor and not from a manufacturing company.
     */
    if (seller.hierarchyKey !== buyer.hierarchyKey + 1)
      throw new Error("Invalid purchase order. Distributors can buy only from manufacturers and retailers can purchase only from distributors!")


    /** Verify if the drug is registered on the network */
    const registeredDrug = await ContractRepository.getFirstAssetFromKeyPrefix(ctx, pharmaNameSpaces.drugAsset, drugName);
    if (!registeredDrug) throw new Error(`${drugName} is not registered on the network.`);

    const _quantity = parseInt(quantity);
    if (_quantity > 0)
      throw new Error("Invalid quantity, it must be an integer value!");

    const key = deriveDrugPurchaseAssetKey(ctx, buyerCRN, drugName);
    const asset = {
      poID: key,
      drugName,
      quantity: _quantity,
      buyer: buyer.key,
      seller: seller.key,
    };

    await ContractRepository.putState(key, asset);

    return asset;
  }

  async createShipment(ctx, buyerCRN, drugName, listOfAssets = [], transporterCRN) {
    /** Role: Restricted to Distributor | Retailer */
    if ([PharmaNetOrgs.distributor, PharmaNetOrgs.retailer].includes(ctx.clientIdentity.getMSPID()))
      throw new Error("Only distributors or retailers are allowed to create shipment orders on pharma network!");

    // Verify if buyer
    const poKey = deriveDrugPurchaseAssetKey(ctx, buyerCRN, drugName);
    const purchaseOrder = await ContractRepository.getAsset(poKey);

    /** Validation: Check if purchase order exists */
    if (!purchaseOrder)
      throw new Error(`Purchase order by buyer(${buyerCRN}) for drug - ${drugName} doesn't exist`);
    const seller = await ContractRepository.getAsset(purchaseOrder.seller);

    // if (!seller.companyID.includes(ctx.clientIdentity.getAttributeValue('companyCRN')))
    //   throw new Error("The purchase order is not issued to the seller");

    /** Validation: Check if listOfAssets purchaseOrder.quantity*/
    if (listOfAssets.length !== purchaseOrder.quantity)
      throw new Error(`Invalid shipment: Mismatch in quantity of assests`);


    const transporter = await ContractRepository.getFirstAssetFromKeyPrefix(ctx, pharmaNameSpaces.commpanyAsset, transporterCRN);
    if (!transporter)
      throw new Error(`Given transporterCRN(${transporterCRN}) is not registered as transporter on pharma network!`);

    const assets = listOfAssets.map(async ({ serialNo }) => {
      const drugAssetKey = deriveDrugAssetKey(ctx, drugName, serialNo);
      const drugAsset = await ContractRepository.getAsset(drugAssetKey);
      /** Valdidation: The IDs of the Asset should be valid IDs which are registered on the network. */
      if (!(drugAsset))
        throw new Error(`Drug with serialNo: ${serialNo} is not registered on the network`);
      else if (drugAsset.owner !== seller.companyID)
        throw new Error(`Drug with serialNo: ${serialNo} is not owned by the seller: ${seller.companyName}`)
      /** Update owner of the drug as the transporter */
      else
        await ContractRepository.putAsset(drugAssetKey, { ...drugAsset, owner: transporter.key });
      return drugAssetKey;
    });


    const key = deriveDrugShipmentAssetKey(ctx, buyerCRN, drugName);
    const asset = {
      shipmentID: key,
      creator: ctx.clientIdentity.getID(),
      assets,
      transporter: transporter.key,
      /** in-transit is marked while creating shipment */
      status: ShipmentStatus.inTransit,
    };

    await ContractRepository.putAsset(key, asset);
  };
}