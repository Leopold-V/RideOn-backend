const execution = async (req, res) => {
  try {
    eval(req.body.code);
    return res.status(200).json({
      message: "Code has been executed on the server !",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Your code is shit",
    });
  }
};

module.exports = { execution };
