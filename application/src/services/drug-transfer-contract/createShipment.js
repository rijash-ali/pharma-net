import { GatewayInstance } from "../../../contractUtils";
import { DRUG_TRANSFER_CONTRACT_KEY } from "../../utils/contractKeys";

export default async function main(mspId, identityKey, txnObj) {
    const gatewayInstance = new GatewayInstance();
    try {
        const { buyerCRN, drugName, listOfAssets, transporterCRN } = txnObj;
        const contract = await gatewayInstance.getContractInstance(DRUG_TRANSFER_CONTRACT_KEY, mspId, identityKey);
        const respBuffer = await contract.submitTransaction('createShipment', buyerCRN, drugName, listOfAssets, transporterCRN);
        return JSON.parse(respBuffer.toString());
    }
    catch(error) {
        console.log("Error occured - createShipment", error);
        throw error;
    }
    finally {
        gatewayInstance.disconnect();
    }
}