const express = require("express");
require("./db/mongoose");
const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/category");
const app = express();
app.use(express.json());
app.use("/users",userRoutes);
app.use("/category",categoryRoutes);
module.exports = app;
