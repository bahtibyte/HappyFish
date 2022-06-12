const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

const app = express();
const PORT = process.env.PORT || 8080;
const webUrl = "http://localhost:3000";
dotenv.config();

app.use(cors({ origin: webUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets"));
app.use(cookieParser());

app.use(
  sessions({
    secret: "thisisthesecretkeythatneedstobemoved",
    saveUninitialized: true,
    cookie: { expires: new Date(2147483647000) },
    resave: false,
  })
);

const router = require("./routes/router");
app.use("/", router);

mongoose
  .connect(process.env.MONGO_HOST, {
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
