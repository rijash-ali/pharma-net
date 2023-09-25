import { GatewayInstance } from "../../../contractUtils";
import { REGISTRATION_CONTRACT_KEY } from "../../utils/contractKeys";

export default async function main(mspId, identityKey, txnObj) {
    const gatewayInstance = new GatewayInstance();
    try {
        const contract = await gatewayInstance.getContractInstance(REGISTRATION_CONTRACT_KEY, mspId, identityKey);
        const { drugName, serialNo, mfgDate, expDate, companyCRN } = txnObj;
        const respBuffer = await contract.submitTransaction('addDrug', drugName, serialNo, mfgDate, expDate, companyCRN);
        return JSON.parse(respBuffer.toString());
    }
    catch (error) {
        console.log("Error occured - addDrug", error);
        throw err;
    }
    finally {
        gatewayInstance.disconnect();
    }
}