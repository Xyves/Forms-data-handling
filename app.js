const express = require("express");
const app = express();
const usersRouter = require("./routes/usersRouter.js");
const usersStorage = require("./storages/usersStorage");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRouter);
app.get("/", (req, res) => {
  res.redirect("/users");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
app.get("/users", (req, res) => {
  res.render("index", { title: "User List", users: usersStorage.getUsers() });
});
