import express from 'express';
import { verifyServiceJwt } from '../middlewares/verifyServiceJwt.middleware.js';
import {
    processAdvisory,
    updateAdvisoryStatus,
    getCitizenAdvisories,
    getAllAdvisories
} from '../controllers/agricultureController.js';

const router = express.Router();

// All internal routes require service JWT verification
router.use(verifyServiceJwt);

// Process new advisory request from Nexus
router.post('/advisory', processAdvisory);

// Update advisory status
router.post('/update-status', updateAdvisoryStatus);

// Get citizen's advisories
router.get('/advisories/citizen', getCitizenAdvisories);

// Get all advisories
router.get('/advisories', getAllAdvisories);

export default router;
