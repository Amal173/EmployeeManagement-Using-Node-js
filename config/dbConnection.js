const mongoose = require("mongoose");
const session = require("express-session");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "Database Connected",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const sessionMiddleware = session({
  secret: process.env.ACCESS_TOKEN_SECRET || "12345",
  resave: false,
  saveUninitialized: true,
});
module.exports = { connectDb, sessionMiddleware };
