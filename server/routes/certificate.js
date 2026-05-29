import { Router } from "express";
import {
  issueCertificate,
  getMyCertificates,
  downloadCertificate,
  verifyCertificate,
} from "../controllers/certificate.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = Router();

router.post("/issue", protect, issueCertificate);
router.get("/my", protect, getMyCertificates);
router.get("/download/:id", protect, downloadCertificate);
router.get("/verify/:certificateId", verifyCertificate);

export default router;
