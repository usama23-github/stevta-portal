import express from "express";

import {
    createPostingPlace
} from "./postingPlace.controller.js";

const router = express.Router();

router.post("/", createPostingPlace);

export default router;