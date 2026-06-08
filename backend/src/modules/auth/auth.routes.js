import express from "express";

import {
  register,
  login,
  logout
} from "./auth.controller.js";

const router = express.Router();

// Development only
// if (process.env.NODE_ENV !== "production") {
//   router.post("/register", controller.register);
// }

router.post("/register", register);

router.post("/login", login);
router.post("/logout", logout);

export default router;