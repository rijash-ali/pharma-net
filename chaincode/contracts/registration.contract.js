'use strict';

const { Contract } = require("fabric-contract-api");
const { ContractRepository } = require("../repository");
const { REGISTRATION_CONTRACT_KEY, deriveCompanyAssetKey, deriveDrugAssetKey, pharmaNameSpaces } = require("../utils/assetKeys");
const { PharmaNetOrgs, PharmaNetRoles } = require("../utils/enums");
const moment = require('moment');

class RegistrationContract extends Contract {
  constructor() {
    super(REGISTRATION_CONTRACT_KEY);
  }

  async instantiate(ctx) {
    console.log('Pharmanet Smart Contract Instantiated');
  }

  /**
   * Register a new company on the network
   * @param ctx - The transaction context object
   * @param companyCRN - Company Registration Number
   * @param companyName - Name of the company
   * @param location - Location of the company
   * @param organisationRole - Role of the company
   * @returns
   */
  async registerCompany(ctx, companyCRN, companyName, location, organisationRole) {

    if (ctx.clientIdentity.getMSPID() === PharmaNetOrgs.consumer)
    throw new Error("Sorry, consumers are not allowed to register companies on pharma network!");

    if (!!(await ContractRepository.getFirstAssetFromKeyPrefix(ctx, pharmaNameSpaces.commpanyAsset, companyCRN)))
      throw new Error(`Company with CRN ${companyCRN} is already registered on the network`);

    if (!Object.keys(PharmaNetRoles).includes(organisationRole))
      throw new Error(`Invlaid role - ${organisationRole}`);

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
      hierarchyKey: organisationRole === "Manufacturer" ? PharmaNetRoles.Manufacturer
        : organisationRole === "Distributor" ? PharmaNetRoles.Distributor
          : organisationRole === "Retailer" ? PharmaNetRoles.Retailer
            : PharmaNetRoles.Transporter
    };

    await ContractRepository.putAsset(ctx, key, asset);

    return true;
  };

  /**
	 * Add a new drug on the network
	 * @param ctx - The transaction context object
	 * @param drugName - Name of the drug
	 * @param serialNo - Serial number of the drug
	 * @param mfgDate - Manufacturing date of the drug
	 * @param expDate - Expiry date of the drug
   * @param companyCRN - Company Registration Number of manufacturer
	 * @returns
	 */
  async addDrug(ctx, drugName, serialNo, mfgDate, expDate, companyCRN) {
    /** Check if drug is added by manufacturer organisation */
    if (ctx.clientIdentity.getMSPID() !== PharmaNetOrgs.manufacturer)
    throw new Error("Only manufacturing companies are allowed to add drugs on pharma network!");

    /** Check id company is registered on the network */
    const manufacturer = await ContractRepository.getFirstAssetFromKeyPrefix(ctx, pharmaNameSpaces.commpanyAsset, companyCRN);
    if (!(manufacturer))
      throw new Error(`Company with given CRN - ${companyCRN} is not registered on the network`);

    const mfgMoment = moment(mfgDate);
    if (!mfgMoment.isValid()) throw new Error("Invalid manufacturing date.");

    const expMoment = moment(expDate);
    if (!expMoment.isValid()) throw new Error("Invalid expiry date.");

    if (!expMoment.isAfter(mfgMoment))
      throw new Error("Expiry date must be greater than manufacture date!");

    const key = deriveDrugAssetKey(ctx, drugName, serialNo);

    const asset = {
      productID: key,
      name: drugName,
      manufacturer: manufacturer.key,
      manufacturingDate: mfgDate,
      expiryDate: expDate,
      owner: manufacturer.key,
      shipment: [],
    };

    await ContractRepository.putAsset(ctx, key, asset);

    return true;
  }
}

module.exports.RegistrationContract = RegistrationContract;