const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  console.log('Register body:', req.body);

  try {
    const { name, email, password, role = 'user' } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  console.log('Login body:', req.body);

  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({ token, user: { name: user.name, role: user.role, email: user.email } });
  } catch (err) {
        console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};



