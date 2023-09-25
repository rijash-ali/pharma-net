import { Router } from "express";
import { viewDrugCurrentState, viewHistory } from "../controllers/lifecycle.controller";

const router = Router();

router.post('/view-history/:drugName/:serialNo', viewHistory);
router.post('/view-drug-current-state/:drugName/:serialNo', viewDrugCurrentState);

export default router;