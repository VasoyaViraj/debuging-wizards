import express from "express";
import {
  getWaterAlert,
  sendAdvisory
} from "../controllers/agricultureController.js";

const router = express.Router();

router.post("/internal/water-alert", getWaterAlert);
router.post("/advisory", sendAdvisory);

export default router;
