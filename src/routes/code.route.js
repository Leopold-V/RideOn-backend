const express = require("express");
const code = require("../controllers/code.controllers");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Code entry route",
  });
});

router.post("/execution", code.execution);

module.exports = router;
