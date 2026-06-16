process.env.TZ = "Asia/Karachi";
import "./config/env.js";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";
import importRoutes from "./modules/imports/import.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://portal.stevta.gos.pk",
    ],
    credentials: true,
  })
);

app.use("/api/v1", routes);
app.use("/api/imports", importRoutes);

app.get("/api", (req, res) => {
  res.send("STEVTA API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});