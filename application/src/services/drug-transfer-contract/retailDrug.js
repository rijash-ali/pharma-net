import { GatewayInstance } from "../../../contractUtils";
import { DRUG_TRANSFER_CONTRACT_KEY } from "../../utils/contractKeys";

export default async function main(mspId, identityKey, txnObj) {
    const gatewayInstance = new GatewayInstance();
    try {
        const contract = await gatewayInstance.getContractInstance(DRUG_TRANSFER_CONTRACT_KEY, mspId, identityKey);
        const { drugName, serialNo, retailerCRN, customerAadhar } = txnObj;
        const respBuffer = await contract.submitTransaction('retailDrug', drugName, serialNo, retailerCRN, customerAadhar);
        return JSON.parse(respBuffer.toString());
    }
    catch (error) {
        console.log('Error Occured - retailDrup', error);
        throw error;
    }
    finally {
        gatewayInstance.disconnect();
    }
}