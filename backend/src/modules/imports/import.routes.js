import express from "express";

import upload from "../../middlewares/upload.middleware.js";

import {
  importHierarchyFile,
} from "./import.controller.js";

const router = express.Router();

router.post(
  "/hierarchy",
  upload.single("file"),
  importHierarchyFile
);

export default router;