'use strict';

const CHAINCODE_KEY = 'pharmanet';

const REGISTRATION_CONTRACT_KEY = `${CHAINCODE_KEY}.registration`;
const DRUG_TRANSFER_CONTRACT_KEY = `${CHAINCODE_KEY}.drugTransfer`;
const LIFE_CYCLE_CONTRACT_KEY = `${CHAINCODE_KEY}.lifcycle`;

const pharmaNameSpaces = Object.freeze({
    commpanyAsset: `${CHAINCODE_KEY}.company`,
    drugAsset: `${CHAINCODE_KEY}.drug`,
    drugPurchaseAsset: `${CHAINCODE_KEY}.drugPurchase`,
    drugShipmentAsset: `${CHAINCODE_KEY}.drugShipment`
})

const deriveCompanyAssetKey =
    (ctx, companyCRN, companyName) => ctx.stub.createCompositeKey(pharmaNameSpaces.commpanyAsset, [companyCRN, companyName]);

const deriveDrugAssetKey = (ctx, drugName, serialNo) => ctx.stub.createCompositeKey(pharmaNameSpaces.drugAsset, [drugName, serialNo]);

const deriveDrugPurchaseAssetKey =
    (ctx, buyerCRN, drugName) => ctx.stub.createCompositeKey(pharmaNameSpaces.drugPurchaseAsset, [buyerCRN, drugName]);

const deriveDrugShipmentAssetKey =
    (ctx, buyerCRN, drugName) => ctx.stub.createCompositeKey(pharmaNameSpaces.drugShipmentAsset, [buyerCRN, drugName]);

module.exports = {
    ...module.exports,
    pharmaNameSpaces,
    REGISTRATION_CONTRACT_KEY,
    DRUG_TRANSFER_CONTRACT_KEY,
    LIFE_CYCLE_CONTRACT_KEY,
    deriveCompanyAssetKey,
    deriveDrugAssetKey,
    deriveDrugPurchaseAssetKey,
    deriveDrugShipmentAssetKey,
}
