import { Router } from "express";
import { viewDrugCurrentState, viewHistory } from "../controllers/lifecycle.controller";

const router = Router();

router.post('/view-history', viewHistory);
router.post('/view-drug-current-state', viewDrugCurrentState);

export default router;