import express from "express";

import {
    createPostingPlace
} from "./postingPlace.controller.js";

const router = express.Router();

// Development only
// if (process.env.NODE_ENV !== "production") {
//   router.post("/register", controller.register);
// }

router.post("/", createPostingPlace);

export default router;