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
    phone: '+91 99887 76655',
    designation: 'Managing Director & Operations',
    passwordHash: bcrypt.hashSync('admin123', 10)
  },
  {
    id: 'user-teacher-1',
    name: 'Mrs. Sunita Verma',
    emailOrPhone: 'teacher@tuition.com',
    role: 'TEACHER',
    subject: 'Mathematics',
    phone: '+91 98765 43210',
    hourlyRate: 250,
    qualification: 'M.Sc. Mathematics, B.Ed (10+ Years Experience)',
    bankAccount: 'HDFC Bank •••• 4892 (IFSC: HDFC0001234)',
    passwordHash: bcrypt.hashSync('teacher123', 10)
  },
  {
    id: 'user-student-1',
    name: 'Aryan Sharma',
    emailOrPhone: 'student@tuition.com',
    role: 'STUDENT',
    grade: 'Grade 10',
    hourlyRate: 400,
    phone: '+91 98112 23344',
    parentName: 'Mr. Rajesh Sharma',
    parentPhone: '+91 91234 56789',
    schoolName: 'Delhi Public School (CBSE)',
    passwordHash: bcrypt.hashSync('student123', 10)
  }
];

// POST /api/auth/register
const register = async (req, res) => {
  const { 
    name, 
    emailOrPhone, 
    password, 
    role = 'STUDENT',
    grade,
    subject,
    phone,
    parentName,
    parentPhone,
    qualification
  } = req.body;

  if (!name || !emailOrPhone || !password) {
    return res.status(400).json({ error: 'Name, Email/Mobile, and Password are required.' });
  }

  // Check for duplicate user
  const existing = DEMO_USERS.find(
    u => u.emailOrPhone.toLowerCase() === emailOrPhone.trim().toLowerCase()
  );
  if (existing) {
    return res.status(409).json({ error: 'An account with this email/phone already exists. Please sign in.' });
  }

  // Determine default rates based on role and grade
  let defaultHourlyRate = 400;
  if (role === 'TEACHER') {
    defaultHourlyRate = 250;
  } else if (role === 'STUDENT') {
    if (grade?.includes('11') || grade?.includes('12')) {
      defaultHourlyRate = 600;
    } else if (grade?.includes('8') || grade?.includes('9')) {
      defaultHourlyRate = 350;
    } else {
      defaultHourlyRate = 400; // Grade 10 default
    }
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = {
    id: `user-${role.toLowerCase()}-${Date.now()}`,
    name: name.trim(),
    emailOrPhone: emailOrPhone.trim().toLowerCase(),
    role: role.toUpperCase(),
    grade: grade || (role === 'STUDENT' ? 'Grade 10' : undefined),
    subject: subject || (role === 'TEACHER' ? 'Mathematics' : undefined),
    phone: phone || '+91 98000 00000',
    parentName: parentName || (role === 'STUDENT' ? 'Parent / Guardian' : undefined),
    parentPhone: parentPhone || (role === 'STUDENT' ? '+91 98000 00000' : undefined),
    qualification: qualification || (role === 'TEACHER' ? 'Graduate Tutor' : undefined),
    hourlyRate: defaultHourlyRate,
    passwordHash
  };

  DEMO_USERS.push(newUser);

  // Issue signed JWT token
  const token = jwt.sign(
    { 
      id: newUser.id, 
      name: newUser.name, 
      emailOrPhone: newUser.emailOrPhone, 
      role: newUser.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    message: 'Registration successful! Welcome to TuitionHub.',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      emailOrPhone: newUser.emailOrPhone,
      role: newUser.role,
      grade: newUser.grade,
      hourlyRate: newUser.hourlyRate,
      subject: newUser.subject,
      phone: newUser.phone,
      parentName: newUser.parentName,
      parentPhone: newUser.parentPhone,
      qualification: newUser.qualification
    }
  });
};

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
      subject: user.subject,
      phone: user.phone,
      parentName: user.parentName,
      parentPhone: user.parentPhone,
      qualification: user.qualification
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
      subject: user.subject,
      phone: user.phone,
      parentName: user.parentName,
      parentPhone: user.parentPhone,
      qualification: user.qualification,
      designation: user.designation,
      bankAccount: user.bankAccount,
      schoolName: user.schoolName
    }
  });
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  const userIndex = DEMO_USERS.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  const { name, phone, parentName, parentPhone, subject, qualification, schoolName, bankAccount } = req.body;

  if (name) DEMO_USERS[userIndex].name = name.trim();
  if (phone) DEMO_USERS[userIndex].phone = phone.trim();
  if (parentName) DEMO_USERS[userIndex].parentName = parentName.trim();
  if (parentPhone) DEMO_USERS[userIndex].parentPhone = parentPhone.trim();
  if (subject) DEMO_USERS[userIndex].subject = subject.trim();
  if (qualification) DEMO_USERS[userIndex].qualification = qualification.trim();
  if (schoolName) DEMO_USERS[userIndex].schoolName = schoolName.trim();
  if (bankAccount) DEMO_USERS[userIndex].bankAccount = bankAccount.trim();

  const updated = DEMO_USERS[userIndex];

  return res.json({
    message: 'Profile updated successfully!',
    user: {
      id: updated.id,
      name: updated.name,
      emailOrPhone: updated.emailOrPhone,
      role: updated.role,
      grade: updated.grade,
      hourlyRate: updated.hourlyRate,
      subject: updated.subject,
      phone: updated.phone,
      parentName: updated.parentName,
      parentPhone: updated.parentPhone,
      qualification: updated.qualification,
      designation: updated.designation,
      bankAccount: updated.bankAccount,
      schoolName: updated.schoolName
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
  register,
  login,
  getMe,
  updateProfile,
  getDemoUsers
};
