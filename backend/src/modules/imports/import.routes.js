import express from "express";

import upload from "../../middlewares/upload.middleware.js";

import {
  importHierarchyFile,
  importStaffFile
} from "./import.controller.js";

const router = express.Router();

router.post(
  "/hierarchy",
  upload.single("file"),
  importHierarchyFile
);

router.post(
  "/staff",
  upload.single("file"),
  importStaffFile
);

export default router;