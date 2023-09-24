// import { config } from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const PROJECT_DIR = dirname(fileURLToPath(import.meta.url)).split('/configs')[0];
const TEST_NETWORK_DIR = PROJECT_DIR.replace('application', 'test-network');

export const config = {
    path: {
        identity: PROJECT_DIR + '/blockchain/identity/',
        org1ConnectionProfile: TEST_NETWORK_DIR + '/organizations/peerOrganizations/org1.example.com/connection-org1.yaml',
        org2ConnectionProfile: TEST_NETWORK_DIR + '/organizations/peerOrganizations/org2.example.com/connection-org2.yaml',
        admin_org1: {
            certPath: TEST_NETWORK_DIR + '/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem',
            keyFilePath: TEST_NETWORK_DIR + '/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/priv_sk'
        },
        user_org1: {
            certPath: TEST_NETWORK_DIR + '/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/User1@org1.example.com-cert.pem',
            keyFilePath: TEST_NETWORK_DIR + '/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/priv_sk'
        },
        admin_org2: {
            certPath: TEST_NETWORK_DIR + '/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/signcerts/Admin@org2.example.com-cert.pem',
            keyFilePath: TEST_NETWORK_DIR + '/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/priv_sk'
        },
        user_org2: {
            certPath: TEST_NETWORK_DIR + '/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/signcerts/User1@org2.example.com-cert.pem',
            keyFilePath: TEST_NETWORK_DIR + '/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/keystore/priv_sk'
        }
    }
};
// console.log('test', path.resolve(PROJECT_DIR, `${process.env.FABRIC_NETWORK}.env`));
// config({ path: path.resolve(PROJECT_DIR, `${process.env.NODE_ENV}.env`)});

// console.log('env', process.env);


