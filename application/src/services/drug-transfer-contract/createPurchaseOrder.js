import { ContractInstance } from "../../../contractUtils";
import { DRUG_TRANSFER_CONTRACT_KEY } from "../../utils/contractKeys";

export default async function main(mspId, identityKey, txnObj) {
    const contractInstance = new ContractInstance();
    try {
        const contract = await contractInstance.getContractInstance(DRUG_TRANSFER_CONTRACT_KEY, mspId, identityKey);
        const { buyerCRN, sellerCRN, drugName, quantity } = txnObj;

        const respBuffer = await contract.submitTransaction('createPO', buyerCRN, sellerCRN, drugName, quantity);
        return JSON.parse(respBuffer.toString());
    }
    catch (error) {
        console.log("Error occured - createPO", error);
        throw error;
    }
    finally {
        contractInstance.disconnect();
    }
}