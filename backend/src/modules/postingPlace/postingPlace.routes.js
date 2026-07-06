import express from "express";

import {
    createPostingPlace,
    getAllPostingPlaces
} from "./postingPlace.controller.js";

const router = express.Router();

router.post("/", createPostingPlace);   
router.get("/", getAllPostingPlaces);   

export default router;