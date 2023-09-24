import { ContractInstance } from "../../../contractUtils";
import { REGISTRATION_CONTRACT_KEY } from "../../utils/contractKeys";

export default async function main(mspId, identityKey, txnObj) {
    const contractInstance = new ContractInstance();
    try {
        const contract = await contractInstance.getContractInstance(REGISTRATION_CONTRACT_KEY, mspId, identityKey);
        const { drugName, serialNo, mfgDate, expDate, companyCRN } = txnObj;
        const respBuffer = await contract.submitTransaction('addDrug', drugName, serialNo, mfgDate, expDate, companyCRN);
        return JSON.parse(respBuffer.toString());
    }
    catch (error) {
        console.log("Error occured - addDrug", error);
        throw err;
    }
    finally {
        contractInstance.disconnect();
    }
}