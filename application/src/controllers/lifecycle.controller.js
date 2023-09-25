import _viewHistory from '../services/lifecycle-contract/viewHistory';
import _viewDrugCurrentState from '../services/lifecycle-contract/viewDrugCurrentState';
import { verifyToken } from '../utils/jwtUtils';

export async function viewHistory(req, res) {
    try {
        const { mspId, userIdentity } = verifyToken(req);
        const { drugName, serialNo } = req.params;

        const result = await _viewHistory(mspId, userIdentity, drugName, serialNo);
        res.json(result);
    }
    catch (error) {
        console.log('error', error);
        res.status(500).send(error.message);
    }
}

export async function viewDrugCurrentState(req, res) {
    try {
        const { mspId, userIdentity } = verifyToken(req);
        const { drugName, serialNo } = req.params;
        
        const result = await _viewDrugCurrentState(mspId, userIdentity, drugName, serialNo);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
}