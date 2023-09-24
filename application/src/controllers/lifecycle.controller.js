import _viewHistory from '../services/lifecycle-contract/viewHistory';
import _viewDrugCurrentState from '../services/lifecycle-contract/viewDrugCurrentState';

export async function viewHistory(req, res) {
    try {
        const result = await _viewHistory(req.body.data);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
}

export async function viewDrugCurrentState(req, res) {
    try {
        const result = await _viewDrugCurrentState(req.body.data);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
}