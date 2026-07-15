import express from "express";

import upload from "../../middlewares/upload.middleware.js";

import {
  importHierarchyFile,
  importStaffFile,
  importSectionFile,
  importDesignationFile
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

router.post(
  "/section",
  upload.single("file"),
  importSectionFile
);

router.post(
  "/designation",
  upload.single("file"),
  importDesignationFile
);

export default router;