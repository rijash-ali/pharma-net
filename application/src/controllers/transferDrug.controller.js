import _createPurchaseOrder from '../services/drug-transfer-contract/createPurchaseOrder';
import _createShipment from '../services/drug-transfer-contract/createShipment';
import _updateShipment from '../services/drug-transfer-contract/updateShipment';
import _retailDrug from '../services/drug-transfer-contract/retailDrug';
import { verifyToken } from '../utils/jwtUtils';

export async function createPurchaseOrder(req, res) {
    try {
        const { mspId, userIdentity } = verifyToken(req);
        const result = await _createPurchaseOrder(mspId, userIdentity, req.body);
        res.json(result);
    }
    catch(error) {
        res.status(500).send(error);
    }
}

export async function createShipment(req, res) {
    try {
        const { mspId, userIdentity } = verifyToken(req);
        const result = await _createShipment(mspId, userIdentity, req.body);
        res.json(result);
    }
    catch(error) {
        res.status(500).send(error);
    }
}

export async function updateShipment(req, res) {
    try {
        const { mspId, userIdentity } = verifyToken(req);
        const result = await _updateShipment(mspId, userIdentity, req.body);
        res.json(result);
    }
    catch(error) {
        res.status(500).send(error);
    }
}

export async function retailDrug(req, res) {
    try {
        const { mspId, userIdentity } = verifyToken(req);
        const result = await _retailDrug(mspId, userIdentity, req.body);
        res.json(result);
    }
    catch(error) {
        res.status(500).send(error);
    }
}
