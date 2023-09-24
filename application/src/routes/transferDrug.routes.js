import { Router } from "express";
import { createPurchaseOrder, createShipment } from "../controllers/transferDrug.controller";

const router = Router();

router.post('/create-purchase-order', createPurchaseOrder);
router.post('create-shipment', createShipment);

export default router;