import "./config/env.js";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import importRoutes from "./modules/imports/import.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/imports", importRoutes);

app.get("/", (req, res) => {
  res.send("STEVTA API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});