import _registerCompany from '../services/register-contract/registerCompany';
import _addDrug from '../services/register-contract/addDrug';

export async function registerCompany(req, res) {
  try {
    const result = await _registerCompany(req.body.data);
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export async function addDrug(req, res) {
  try {
    const result = await _addDrug(req.body.data);
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};