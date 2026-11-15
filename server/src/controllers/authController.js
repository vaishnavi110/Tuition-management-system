const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Seed demo users for local testing
const DEMO_USERS = [
  {
    id: 'user-admin-1',
    name: 'Academy Director (Admin)',
    emailOrPhone: 'admin@tuition.com',
    role: 'ADMIN',
    // bcrypt hash of 'admin123'
    passwordHash: bcrypt.hashSync('admin123', 10)
  },
  {
    id: 'user-teacher-1',
    name: 'Mrs. Sunita Verma',
    emailOrPhone: 'teacher@tuition.com',
    role: 'TEACHER',
    subject: 'Mathematics',
    phone: '+91 98765 43210',
    // bcrypt hash of 'teacher123'
    passwordHash: bcrypt.hashSync('teacher123', 10)
  },
  {
    id: 'user-student-1',
    name: 'Aryan Sharma',
    emailOrPhone: 'student@tuition.com',
    role: 'STUDENT',
    grade: 'Grade 10',
    hourlyRate: 400,
    parentPhone: '+91 91234 56789',
    // bcrypt hash of 'student123'
    passwordHash: bcrypt.hashSync('student123', 10)
  }
];

// POST /api/auth/login
const login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: 'Email/Phone and password are required.' });
  }

  // Find user (in demo store or database)
  const user = DEMO_USERS.find(
    u => u.emailOrPhone.toLowerCase() === emailOrPhone.trim().toLowerCase()
  );

  if (!user) {
    return res.status(401).json({ error: 'User not found. Check your email or use a demo account.' });
  }

  // Verify password with bcrypt
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid password. Please try again.' });
  }

  // Issue signed JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      name: user.name, 
      emailOrPhone: user.emailOrPhone, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      emailOrPhone: user.emailOrPhone,
      role: user.role,
      grade: user.grade,
      hourlyRate: user.hourlyRate,
      subject: user.subject
    }
  });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  const user = DEMO_USERS.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      emailOrPhone: user.emailOrPhone,
      role: user.role,
      grade: user.grade,
      hourlyRate: user.hourlyRate,
      subject: user.subject
    }
  });
};

// GET /api/auth/demo-users
const getDemoUsers = (req, res) => {
  return res.json({
    demoAccounts: [
      { role: 'ADMIN', email: 'admin@tuition.com', password: 'admin123', label: 'Admin Console' },
      { role: 'TEACHER', email: 'teacher@tuition.com', password: 'teacher123', label: 'Teacher Portal' },
      { role: 'STUDENT', email: 'student@tuition.com', password: 'student123', label: 'Student Portal' }
    ]
  });
};

module.exports = {
  login,
  getMe,
  getDemoUsers
};
