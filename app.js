// External Dependencies
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Internal Dependencies
import connectDb from "./config/db.js";

// Models
import Opportunity from "./models/opportunity.model.js";

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/api/opportunities", async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      status: "approved",
      deadline: { $gte: new Date() },
    })
      .select(
        "_id title type organizer deadline location eventDate mode startTime endTime",
      )
      .sort({ deadline: 1 });
    res.status(200).json({ status: "ok", opportunities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Something went wrong!" });
  }
});

app.get("/api/opportunity/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const opportunity = await Opportunity.findById(id);

    res.status(200).json({ status: "ok", opportunity });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong!" });
  }
});

app.get("/", async (req, res) => {
  const response = await fetch("http://localhost:8080/api/opportunities");
  const data = await response.json();

  res.render("index", { opportunities: data.opportunities });
});

app.get("/opportunity/:id", async (req, res) => {
  const { id } = req.params;
  const response = await fetch(`http://localhost:8080/api/opportunity/${id}`);
  const data = await response.json();

  if (!data.opportunity) {
    return res.send("Opportunity not found!");
  }

  res.render("details", { opportunity: data.opportunity });
});

app.get("/admin", (req, res) => {
  res.send("Admin Panel");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server!", error);
  }
};

startServer();
