import { ContractInstance } from "../../../contractUtils";
import { DRUG_TRANSFER_CONTRACT_KEY } from "../../utils/contractKeys";

export default async function main(mspId, identityKey, txnObj) {
    const contractInstance = new ContractInstance();
    try {
        const contract = await contractInstance.getContractInstance(DRUG_TRANSFER_CONTRACT_KEY, mspId, identityKey);
        const { drugName, serialNo, retailerCRN, customerAadhar } = txnObj;
        const respBuffer = await contract.submitTransaction('retailDrug', drugName, serialNo, retailerCRN, customerAadhar);
        return JSON.parse(respBuffer.toString());
    }
    catch (error) {
        console.log('Error Occured - retailDrup', error);
        throw error;
    }
    finally {
        contractInstance.disconnect();
    }
}