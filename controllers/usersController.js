const asyncHandler = require("express-async-handler");
const usersStorage = require("../storages/usersStorage");
const { body, validationResult } = require("express-validator");
var bodyParser = require("body-parser");

exports.usersListGet = asyncHandler(async (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
});

exports.usersCreateGet = asyncHandler(async (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
});
let data = {};
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const ageErr = "age must be between 18 and 120";
const bioErr = "must contain maximum 200 characters";
const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body("email").trim().isEmail().normalizeEmail(),
  body("age").trim().isInt({ min: 18, max: 120 }).withMessage(`Age ${ageErr}`),
  body("bio").trim().isLength({ max: 200 }).withMessage(`Bio ${bioErr}`),
];

exports.usersUpdateGet = asyncHandler(async (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  console.log(user);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
});
exports.usersCreatePost = asyncHandler(async (req, res) => {
  const { firstName, lastName, age, email, bio } = req.body;
  usersStorage.addUser({ firstName, lastName, age, email, bio });
  res.redirect("/");
});
exports.usersUpdatePost = [
  validateUser,
  asyncHandler(async (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.updateUser(req.params.id, {
      firstName,
      lastName,
      age,
      bio,
      email,
    });
    res.redirect("/");
  }),
];
exports.usersDeletePost = asyncHandler(async (req, res) => {
  usersStorage.deleteUser(req.params.id);
  console.log("Deleted!");
  res.redirect("/");
});

exports.usersSearchGet = asyncHandler(async (req, res) => {
  res.render("search", { title: "Search", user: user });
});
exports.usersSearchPost = asyncHandler(async (req, res) => {
  const email = req.body.search;
  const user = usersStorage.getUserByEmail(email);

  if (user) {
    res.redirect(`/${user.id}/update`);
  } else {
    res.redirect("/");
  }
  // if (id) res.redirect(`/${id}/update`);
});
