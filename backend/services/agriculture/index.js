import express from "express";
import cors from "cors";
import agricultureRoutes from "./src/routes/agricultureRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", agricultureRoutes);

const PORT = 4002;

app.listen(PORT, () => {
  console.log(`Agriculture service running on port ${PORT}`);
});

