import { Contract } from "fabric-contract-api";
import {
    deriveCompanyAssetKey,
    deriveDrugAssetKey, 
    deriveDrugPurchaseAssetKey, 
    deriveDrugShipmentAssetKey, 
    NETWORK_KEY
} from '../utils/assetKeys';

export class PharmaSupplychain extends Contract {
    constructor() {
        super(NETWORK_KEY);
    }

    registerCompany = async (ctx, companyCRN, companyName, location, organisationRole) => {
        const key = deriveCompanyAssetKey(ctx, companyCRN, companyName);
        const asset = {
            companyID: key,
            name: companyName,
            location,
            /** Manufacturer | Distributor | Retailer | Transporter */
            organisationRole,
            /** Manufacturer (1st level) → Distributor (2nd level) → Retailer (3rd level)
             * Note: There will be no hierarchy key for transporters.
              */
            hierarchyKey
        };

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(asset)));
    };

    /** Role: Restricted to Manufacturer */
    addDrug = async (ctx, drugName, serialNo, mfgDate, expDate, companyCRN) => {
        const key = deriveDrugAssetKey(ctx, drugName, serialNo);

        /** manufacturer: Composite key of the manufacturer used to store manufacturer’s detail on the ledger */
        const manufacturerKey = deriveCompanyAssetKey(ctx, companyCRN, ctx.clientIdentity.getID());
        const asset = {
            productID: key,
            name: drugName,
            manufacturer: manufacturerKey,
            manufacturingDate: mfgDate,
            expiryDate: expDate,
            owner: manufacturerKey,
            shipment: [],
        };

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(asset)));
    };

    /** Role: Restricted to Distributor | Retailer */
    /**
     * Validations:
     * You need to make sure that the transfer of drug takes place in a hierarchical manner
     * and no organisation in the middle is skipped. 
     * For example, you need to make sure that a retailer is able to purchase drugs only from a distributor and not from a manufacturing company.
     */
    createPO = async (ctx, buyerCRN, sellerCRN, drugName, quantity) => {
        const key = deriveDrugPurchaseAssetKey(ctx, buyerCRN, drugName);

        const buyer = deriveCompanyAssetKey(ctx, buyerCRN, ctx.clientIdentity.getID());
        const seller = deriveCompanyAssetKey(ctx, sellerCRN, ctx.clientIdentity.getID());

        const asset = {
            poID: key,
            drugName,
            quantity,
            buyer,
            seller,
        };

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(asset)));
    };

    /** Note: The owner of each item of the batch should also be updated. */
    createShipment = async (ctx, buyerCRN, drugName, listOfAssets = [], transporterCRN) => {
        const key = deriveDrugShipmentAssetKey(ctx, buyerCRN, drugName);
        const assets = listOfAssets.map(({ serialNo }) => deriveDrugAssetKey(ctx, drugName, serialNo));
        const transporter = deriveCompanyAssetKey(ctx, transporterCRN, 'test')
        const asset = {
            shipmentID: key,
            creator: ctx.clientIdentity.getID(),
            assets,
            transporter,
            /** in-transit | delivered */
            status: 'in-transit',
        };

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(asset)));
    };

    /** Role: Restricted to Transporter */
    updateShipment = async (ctx, buyerCRN, drugName, transporterCRN) => {
        const key = deriveDrugShipmentAssetKey(ctx, buyerCRN, drugName);

        const assetBuffer = await ctx.stub.getState(key);
        const consignment = JSON.parse(assetBuffer.toString());

        /** Refactor using Rich queries from Couch Db */
        consignment.assets.map(async drugAssetKey => {
            const drugAssetBuffer = await ctx.getState(drugAssetKey);
            const drugAsset = JSON.parse(drugAssetBuffer.toString());
            const updatedDrugAsset = {
                ...drugAsset,
                owner: deriveCompanyAssetKey(ctx, buyerCRN, 'test'),
                shipment: [...drugAsset.shipment, key],
            };
            await ctx.stub.putState(drugAssetKey, updatedDrugAsset);
        });

        const updatedAsset = { ...consignment, status: 'delivered' };
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(updatedAsset)));
    };

    /** Role: Restricted to Retailer cum owner of the drug */
    retailDrug = async (ctx, drugName, serialNo, retailerCRN, customerAadhar) => {
        const drugAssetKey = deriveDrugAssetKey(ctx, drugName, serialNo);
        const drugAssetBuffer = await ctx.stub.getState(drugAssetKey);
        const drugAsset = JSON.parse(drugAssetBuffer.toString());

        const updatedAsset = {
            ...drugAsset,
            owner: customerAadhar
        };
        await ctx.stub.putState(drugAssetKey, updatedAsset);
    };

    viewHistory = async (ctx, drugName, serialNo) => { };

    viewDrugCurrentState = async (ctx, drugName, serialNo) => {
        const drugAssetKey = deriveDrugAssetKey(ctx, drugName, serialNo);
        const drugAssetBuffer = await ctx.stub.getState(drugAssetKey);
        return JSON.parse(drugAssetBuffer.toString());
    };
} 