import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { authRouter } from "./routes/authRoutes.js";
import { moduleRouter } from "./routes/moduleRoutes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/modules", moduleRouter);

app.use(errorMiddleware);

app.listen(config.portal.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Portal backend listening on port ${config.portal.port}`);
});
