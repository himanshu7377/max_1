const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the email is already in use
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "Email already exists" });
    }

     // Hash the password
     const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await user.save();

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    req.session.userId = user._id;

    console.log('session',req.session);
    res.status(200).send({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
};

exports.getCurrentUser = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send("Not authenticated to get current user");
  }
  try {
    const user = await User.findById(req.session.userId).select('-password'); // Exclude password from response
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching user");
  }
};

