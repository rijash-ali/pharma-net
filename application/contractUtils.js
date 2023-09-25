import { Gateway, Wallets } from "fabric-network";
import fs from 'fs';
import { config } from "./configs/config";
import { CHAINCODE_KEY } from "./src/utils/contractKeys";

export const mspIds = Object.freeze({
  Org1MSP: 'Org1MSP',
  Org2MSP: 'Org2MSP',
});

export const usersIdentityKeys = Object.freeze({
  ADMIN_ORG1: 'ADMIN_ORG1',
  USER1_ORG1: 'USER1_ORG1',
  ADMIN_ORG2: 'ADMIN_ORG2',
  USER1_ORG2: 'USER1_ORG2',
});

export class GatewayInstance {
  #gateway;

  constructor() {
    this.#gateway = new Gateway();
  }

  async getContractInstance(contractKey, mspId, identityKey) {
    const connectionProfile = jsyaml.load(fs.readFileSync(config.path.connectionProfile));
    const wallet = await Wallets.newFileSystemWallet(`./identity/${mspId.replace('MSP', '').toLowerCase()}`);
    const gatewayOptions = {
      wallet,
      identity: identityKey,
      /** parameter to discover the network */
      discovery: {
        enabled: true,
        asLocalhost: true,
      }
    };

    await this.#gateway.connect(connectionProfile, gatewayOptions);
    const channel = await this.#gateway.getNetwork('mychannel');
    const contract = channel.getContract(CHAINCODE_KEY, contractKey);
    return contract;
  }

  disconnect() {
    this.#gateway.disconnect();
  }
}
