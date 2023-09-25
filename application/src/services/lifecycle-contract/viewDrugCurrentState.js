import { LIFE_CYCLE_CONTRACT_KEY } from "../../utils/contractKeys";
import { GatewayInstance } from "../../../contractUtils";

export default async function main(mspId, identityKey, drugName, serialNo) {
    const gatewayInstance = new GatewayInstance();
    try {
        const contract = await gatewayInstance.getContractInstance(LIFE_CYCLE_CONTRACT_KEY, mspId, identityKey);
        const respBuffer = await contract.evaluateTransaction('viewDrugCurrentState', drugName, serialNo);
        return JSON.parse(respBuffer.toString());
    }
    catch (error) {
        console.log('Error Occurred - viewDrugCurrentState', error);
        throw error;
    }
    finally {
        gatewayInstance.disconnect();
    }
}