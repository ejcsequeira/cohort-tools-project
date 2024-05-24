const router = require("express").Router();

// verify
router.get("/verify", (req, res) => {
  const { payload } = req;
  res.send(payload);
});

module.exports = router;
