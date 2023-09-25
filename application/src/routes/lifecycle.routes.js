import { Router } from "express";
import { viewDrugCurrentState, viewHistory } from "../controllers/lifecycle.controller";

const router = Router();

router.get('/view-history/:drugName/:serialNo', viewHistory);
router.get('/view-drug-current-state/:drugName/:serialNo', viewDrugCurrentState);

export default router;