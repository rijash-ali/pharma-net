'use strict'

import fs from 'fs';
import { Wallets } from 'fabric-network';
import { config } from './configs/config';

/**
 * 
 * @param {*} certificatePath - path for the certificate entity
 * @param {*} keyFilePath - path for the pvt key file entity
 */
async function main(certificatePath, keyFilePath, mspId, identityKey) {
  const wallet = await Wallets.newFileSystemWallet(`./identity/${mspId.replace('MSP', '').toLowerCase()}`);
  const certificate = fs.readFileSync(certificatePath).toString();
  const privateKey = fs.readFileSync(keyFilePath).toString();
  const identity = {
    credentials: {
      certificate,
      privateKey
    },
    mspId,
    type: 'X.509'
  };
  await wallet.put(identityKey, identity);
  console.log('Successfully added identity to the wallet', await wallet.get(identityKey));
}



main(config.path.admin_org1.certPath, config.path.admin_org1.keyFilePath, 'Org1MSP', 'ADMIN_ORG1');
main(config.path.user_org1.certPath, config.path.user_org1.keyFilePath, 'Org1MSP', 'USER1_ORG1');
main(config.path.admin_org2.certPath, config.path.admin_org2.keyFilePath, 'Org2MSP', 'ADMIN_ORG2');
main(config.path.user_org2.certPath, config.path.user_org2.keyFilePath, 'Org2MSP', 'USER1_ORG2');
