import { Router } from "express";
import { createPurchaseOrder, createShipment, retailDrug, updateShipment } from "../controllers/transferDrug.controller";

const router = Router();

router.post('/create-purchase-order', createPurchaseOrder);
router.post('/create-shipment', createShipment);
router.post('/update-shipment', updateShipment);
router.post('/retail-drug', retailDrug);

export default router;