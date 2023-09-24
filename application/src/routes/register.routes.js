import { Router } from "express";
import { addDrug, registerCompany } from "../controllers/register.controller";

const router = Router();

router.post('/register-company', registerCompany);
router.post('/register-drug', addDrug);

export default router;