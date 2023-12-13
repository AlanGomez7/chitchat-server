const express = require("express");
const router = express.Router();
const { login, search, signup } = require("../controllers/userControllers");

router.post("/login", login);

router.get("/search", search);

router.post("/signup", signup);

module.exports = router;
