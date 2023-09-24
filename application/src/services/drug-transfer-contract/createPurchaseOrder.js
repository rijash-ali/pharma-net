import { GatewayInstance } from "../../../contractUtils";
import { DRUG_TRANSFER_CONTRACT_KEY } from "../../utils/contractKeys";

export default async function main(mspId, identityKey, txnObj) {
    const gatewayInstance = new GatewayInstance();
    try {
        const contract = await gatewayInstance.getContractInstance(
            DRUG_TRANSFER_CONTRACT_KEY,
            mspId,
            identityKey
        );
        const { buyerCRN, sellerCRN, drugName, quantity } = txnObj;

        const respBuffer = await contract.submitTransaction('createPO', buyerCRN, sellerCRN, drugName, quantity);
        return JSON.parse(respBuffer.toString());
    }
    catch (error) {
        console.log("Error occured - createPO", error);
        throw error;
    }
    finally {
        gatewayInstance.disconnect();
    }
}