import _createPurchaseOrder from '../services/drug-transfer-contract/createPurchaseOrder';
import _createShipment from '../services/drug-transfer-contract/createShipment';

export async function createPurchaseOrder(req, res) {
    try {
        const result = await _createPurchaseOrder(req.body.data);
        res.json(result);
    }
    catch(error) {
        res.status(500).send(error);
    }
}

export async function createShipment(req, res) {
    try {
        const result = await _createShipment(req.body.data);
        res.json(result);
    }
    catch(error) {
        res.status(500).send(error);
    }
}