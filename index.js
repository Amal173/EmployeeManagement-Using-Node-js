const express = require("express");
const bodyParser = require("body-parser");
const { connectDb, sessionMiddleware } = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const path = require("path");
const isAuthenticated = require("./service/auth");

connectDb(); 
const app = express();
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));
const port = process.env.PORT || 5000;

app.use(express.static(path.join()));

app.use(express.json());

app.use("/employee/api", require("./routes/employeesRoutes"));
app.use("/register", require("./routes/userRouter"));
app.use(errorHandler);

app.get("/home", isAuthenticated, (req, res) => {
  res.render("index");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/forgotPassword", (req, res) => {
  res.render("forgotPassword");
});
app.get("/otpVarification", (req, res) => {
  res.render("otpVarification");
});
app.get("/resetPassword", (req, res) => {
  res.render("resetPassword");
});
app.get("/", (req, res) => {
  res.render("login");
});
app.get("/viewEmployee", isAuthenticated, (req, res) => {
  res.render("viewEmployee");
});
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
