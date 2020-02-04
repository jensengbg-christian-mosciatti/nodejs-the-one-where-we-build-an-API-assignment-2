// const Joi = require("@hapi/joi");
const express = require("express");
const app = express();
app.use(express.static("public"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const { initiateDatabase } = require("./modules/database");

const port = process.env.PORT || 8000;

require("./modules/routes")(app);

app.listen(port, () => {
  initiateDatabase();
  console.log("Server started, listening port: ", port);
});
