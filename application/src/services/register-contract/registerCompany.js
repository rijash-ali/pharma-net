'use-strict';

import { ContractInstance } from "../../../contractUtils";
import { REGISTRATION_CONTRACT_KEY } from "../../utils/contractKeys";

export default async function main(mspId, identityKey, txnObj) {
  const gatewayInstance = new ContractInstance();
  try {
    const contract = await gatewayInstance.getContractInstance(REGISTRATION_CONTRACT_KEY, mspId, identityKey);
    const { companyCRN, companyName, location, organisationRole } = txnObj;
    const responseBuffer = await contract.submitTransaction('registerCompany', companyCRN, companyName, location, organisationRole);
    return JSON.parse(responseBuffer.toString());
  }
  catch (err) {
    console.log("Error occured - registerCompany", err);
    throw err;
  }
  finally {
    gatewayInstance.disconnect();
  }
}