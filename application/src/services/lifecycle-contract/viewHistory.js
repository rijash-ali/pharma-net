import { LIFE_CYCLE_CONTRACT_KEY } from "../../../../chaincode/utils/assetKeys";
import { GatewayInstance } from "../../../contractUtils";

export default async function main(mspId, identityKey, drugName, serialNo) {
    const gatewayInstance = new GatewayInstance();
    try {
        const contract = await gatewayInstance.getContractInstance(LIFE_CYCLE_CONTRACT_KEY, mspId, identityKey);
        const respBuffer = await contract.evaluateTransaction('viewHistory', drugName, serialNo);
        return JSON.parse(respBuffer.toString());
    }
    catch (error) {}
    finally {
        gatewayInstance.disconnect();
    }
}