import { ContractInstance } from "../../../contractUtils";
import { DRUG_TRANSFER_CONTRACT_KEY } from "../../utils/contractKeys";

export default async function main(mspId, identityKey, txnObj) {
    const contractInstance = new ContractInstance();
    try {
        const contract = await contractInstance.getContractInstance(DRUG_TRANSFER_CONTRACT_KEY, mspId, identityKey);
        const { buyerCRN, drugName, transporterCRN } = txnObj;
        const respBuffer = await contract.submitTransaction('updateShipment', buyerCRN, drugName, transporterCRN);
        return JSON.parse(respBuffer.toString());
    }
    catch (error) {
        console.log('Error Occurred - updateShipment', error);
        throw error;
    }
    finally {
        contractInstance.disconnect();
    }
}