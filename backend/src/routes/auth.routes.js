import express from "express";
import {
  signup,
  signin,
  dataComingFromGoogle,
  uploadProfilePic,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import upload from "../multer/index.js";

const router = express();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", dataComingFromGoogle);
router.post("/upload", upload.single("file"), uploadProfilePic);
export default router;
