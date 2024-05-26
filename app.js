const express = require("express");
const cors = require("cors");
const dbconnection = require("./core/db/db.js");
const cookieParser = require('cookie-parser');
const router = require("./router.js");


const app = express();

// Use cookie-parser middleware
app.use(cookieParser());


//CORS OPTIONS
const corsOptions = {
//   origin: process.env.FRONTEND_PROD,
  origin: '*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Product tracking APP");
});

app.use("/api", router);

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// Connect Database
dbconnection();

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});

// Handling Unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting Down Server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
