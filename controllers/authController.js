const { User, Student, Facilitator, Manager } = require('../models');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { email, password, first_name, last_name, role, ...extraFields } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in main User table
    const user = await User.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      role
    });

    // Depending on role, create record in role-specific table
    if (role === 'student') {
      await Student.create({ userId: user.id, ...extraFields }); 
    } else if (role === 'facilitator') {
      await Facilitator.create({ userId: user.id, ...extraFields });
    } else if (role === 'manager') {
      await Manager.create({ userId: user.id, ...extraFields });
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    res.status(201).json({ message: 'User registered successfully', userId: user.id });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
