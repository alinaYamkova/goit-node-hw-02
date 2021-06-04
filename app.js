const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./src/routes/api/Contacts");
const usersRouter = require("./src/routes/api/Users");

const app = express();
const { HttpCode } = require('./helpers/constants')

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ status: "error", code: HttpCode.NOT_FOUND, message: "Not found" });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res
    .status(status)
    .json({ status: "fail", code: status, message: err.message });
});

module.exports = app;
