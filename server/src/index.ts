import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { searchRouter } from "./routes/search.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", searchRouter);

app.get("/health", async (_req, res) => {
  res.json({
    status: "ok",
    architecture: "multi-stage-agent",
    timestamp: new Date().toISOString(),
  });
});

// Serve client build in production
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
});
