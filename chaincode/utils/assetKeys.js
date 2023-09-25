const CHAINCODE_KEY = 'pharmanet';

export const REGISTRATION_CONTRACT_KEY = `${CHAINCODE_KEY}.registration`;
export const DRUG_TRANSFER_CONTRACT_KEY = `${CHAINCODE_KEY}.drugTransfer`;
export const LIFE_CYCLE_CONTRACT_KEY = `${CHAINCODE_KEY}.lifcycle`;

export const pharmaNameSpaces = Object.freeze({
    commpanyAsset: `${CHAINCODE_KEY}.company`,
    drugAsset: `${CHAINCODE_KEY}.drug`,
    drugPurchaseAsset: `${CHAINCODE_KEY}.drugPurchase`,
    drugShipmentAsset: `${CHAINCODE_KEY}.drugShipment`
})

export const deriveCompanyAssetKey =
    (ctx, companyCRN, companyName) => ctx.stub.createCompositeKey(pharmaNameSpaces.commpanyAsset, [companyCRN, companyName]);

export const deriveDrugAssetKey = (ctx, drugName, serialNo) => ctx.stub.createCompositeKey(pharmaNameSpaces.drugAsset, [drugName, serialNo]);

export const deriveDrugPurchaseAssetKey =
    (ctx, buyerCRN, drugName) => ctx.stub.createCompositeKey(pharmaNameSpaces.drugPurchaseAsset, [buyerCRN, drugName]);

export const deriveDrugShipmentAssetKey =
    (ctx, buyerCRN, drugName) => ctx.stub.createCompositeKey(pharmaNameSpaces.drugShipmentAsset, [buyerCRN, drugName]);
