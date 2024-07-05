const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debug statement to print JWT_SECRET
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  console.log("Generated Token:", token); // Print the generated token
  return token;
};

module.exports = generateToken;
