import _registerCompany from '../services/register-contract/registerCompany';
import _addDrug from '../services/register-contract/addDrug';
import { verifyToken } from '../utils/jwtUtils';

export async function registerCompany(req, res) {
  try {
    const { mspId, userIdentity } = verifyToken(req);
    const result = await _registerCompany(mspId, userIdentity, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export async function addDrug(req, res) {
  try {
    const { mspId, userIdentity } = verifyToken(req);
    const result = await _addDrug(mspId, userIdentity, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};