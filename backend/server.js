import express from "express";
import cors from "cors";
import pollRoutes from "./routes/pollRoutes.js";


const app = express();

// allow CORS for frontend (development)
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// connect routes
app.use("/", pollRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
