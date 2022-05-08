const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

dotenv.config();

mongoose
  .connect(
    process.env.MONGO_URL 
  )
  .then(() => console.log("DB connection successfull!"))
  .catch((err) => console.log(err));

const app = express();  
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("backend server is running");
});