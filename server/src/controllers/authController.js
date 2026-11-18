const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const prisma = require('../prisma');

// Valid academy invitation codes for controlled staff onboarding
const VALID_TEACHER_INVITES = ['TUTOR-2026-INVITE', 'ACADEMY-TUTOR-2026', 'TUTOR-DEMO'];
const VALID_ADMIN_INVITES = ['ADMIN-SUPER-2026', 'DIRECTOR-2026', 'ADMIN-DEMO'];

// Seed demo users for local fallback
const DEMO_USERS = [
  {
    id: 'user-admin-1',
    name: 'Managing Director Sharma',
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
    qualification: 'Senior Mathematics Faculty, M.Sc. Math, B.Ed (10+ years experience)',
    bankAccount: 'HDFC Bank •••• 4892 (IFSC: HDFC0001234)',
    passwordHash: bcrypt.hashSync('teacher123', 10)
  },
  {
    id: 'user-student-1',
    name: 'Aryan Sharma',
    emailOrPhone: 'student@tuition.com',
    role: 'STUDENT',
    grade: 'Grade 10 (Board)',
    hourlyRate: 400,
    phone: '+91 98112 23344',
    parentName: 'Mr. Rajesh Sharma',
    parentPhone: '+91 91234 56789',
    schoolName: 'Delhi Public School (CBSE)',
    passwordHash: bcrypt.hashSync('student123', 10)
  }
];

// Helper to format user for client responses
const formatUserResponse = (user, profile = {}) => {
  return {
    id: user.id,
    name: user.name,
    emailOrPhone: user.emailOrPhone,
    role: user.role,
    grade: user.student?.grade?.name || user.grade || (user.role === 'STUDENT' ? 'Grade 10 (Board)' : undefined),
    hourlyRate: user.student?.grade?.studentHourlyRate || (user.role === 'TEACHER' ? 250 : 400),
    subject: user.subject || (user.role === 'TEACHER' ? 'Mathematics' : undefined),
    phone: user.teacher?.phone || user.student?.parentPhone || user.phone || '+91 98000 00000',
    parentName: user.parentName || (user.role === 'STUDENT' ? 'Mr. Rajesh Sharma' : undefined),
    parentPhone: user.student?.parentPhone || user.parentPhone || (user.role === 'STUDENT' ? '+91 91234 56789' : undefined),
    schoolName: user.schoolName || (user.role === 'STUDENT' ? 'Delhi Public School' : undefined),
    qualification: user.teacher?.bio || user.qualification || (user.role === 'TEACHER' ? 'Senior Faculty' : undefined),
    designation: user.designation || (user.role === 'ADMIN' ? 'Managing Director & Operations' : undefined),
    bankAccount: user.bankAccount || (user.role === 'TEACHER' ? 'HDFC Bank •••• 4892' : undefined)
  };
};

// POST /api/auth/register
const register = async (req, res) => {
  const { 
    name, 
    emailOrPhone, 
    password, 
    role = 'STUDENT',
    inviteCode,
    grade,
    subject,
    phone,
    parentName,
    parentPhone,
    qualification,
    schoolName,
    designation
  } = req.body;

  if (!name || !emailOrPhone || !password) {
    return res.status(400).json({ error: 'Name, Email/Mobile, and Password are required.' });
  }

  const normalizedRole = role.toUpperCase();
  if (normalizedRole === 'TEACHER') {
    if (!inviteCode || !VALID_TEACHER_INVITES.includes(inviteCode.trim().toUpperCase())) {
      return res.status(403).json({ 
        error: 'Teacher registration is strictly by authorized invitation only. Please enter a valid Tutor Invitation Code issued by the Academy Director.' 
      });
    }
  } else if (normalizedRole === 'ADMIN') {
    if (!inviteCode || !VALID_ADMIN_INVITES.includes(inviteCode.trim().toUpperCase())) {
      return res.status(403).json({ 
        error: 'Administrative registration is strictly restricted. Please provide a valid Master Academy Authorization Key.' 
      });
    }
  }

  const cleanEmail = emailOrPhone.trim().toLowerCase();

  // Try checking duplicate and creating user in Render PostgreSQL
  try {
    const existing = await prisma.user.findUnique({
      where: { emailOrPhone: cleanEmail }
    });

    if (existing) {
      return res.status(409).json({ error: 'An account with this email/phone already exists. Please sign in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let defaultGrade = await prisma.grade.findFirst({
      where: { name: { contains: grade || '10' } }
    }) || await prisma.grade.findFirst();

    const createdUser = await prisma.user.create({
      data: {
        name: name.trim(),
        emailOrPhone: cleanEmail,
        role: normalizedRole,
        passwordHash,
        ...(normalizedRole === 'STUDENT' && defaultGrade ? {
          student: {
            create: {
              gradeId: defaultGrade.id,
              parentPhone: parentPhone || phone || '+91 98000 00000',
              address: 'Registered Online'
            }
          }
        } : {}),
        ...(normalizedRole === 'TEACHER' ? {
          teacher: {
            create: {
              phone: phone || '+91 98000 00000',
              bio: qualification || 'Senior Faculty',
              defaultMeetLink: 'https://meet.google.com/new'
            }
          }
        } : {})
      },
      include: {
        student: { include: { grade: true } },
        teacher: true
      }
    });

    const token = jwt.sign(
      { 
        id: createdUser.id, 
        name: createdUser.name, 
        emailOrPhone: createdUser.emailOrPhone, 
        role: createdUser.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const clientUser = formatUserResponse(createdUser);
    DEMO_USERS.push({ ...clientUser, passwordHash });

    return res.status(201).json({
      message: 'Registration successful! Persisted to Render PostgreSQL.',
      token,
      user: clientUser
    });
  } catch (err) {
    console.warn('Prisma register notice (fallback to memory):', err.message);
  }

  // Memory fallback
  const existingMem = DEMO_USERS.find(u => u.emailOrPhone.toLowerCase() === cleanEmail);
  if (existingMem) {
    return res.status(409).json({ error: 'An account with this email/phone already exists. Please sign in.' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = {
    id: `user-${normalizedRole.toLowerCase()}-${Date.now()}`,
    name: name.trim(),
    emailOrPhone: cleanEmail,
    role: normalizedRole,
    grade: grade || (normalizedRole === 'STUDENT' ? 'Grade 10 (Board)' : undefined),
    subject: subject || (normalizedRole === 'TEACHER' ? 'Mathematics' : undefined),
    phone: phone || '+91 98000 00000',
    parentName: parentName || (normalizedRole === 'STUDENT' ? 'Parent / Guardian' : undefined),
    parentPhone: parentPhone || (normalizedRole === 'STUDENT' ? '+91 98000 00000' : undefined),
    schoolName: schoolName || (normalizedRole === 'STUDENT' ? 'Delhi Public School' : undefined),
    qualification: qualification || (normalizedRole === 'TEACHER' ? 'Graduate Tutor' : undefined),
    designation: designation || (normalizedRole === 'ADMIN' ? 'Operations Manager' : undefined),
    hourlyRate: normalizedRole === 'TEACHER' ? 250 : 400,
    passwordHash
  };

  DEMO_USERS.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, name: newUser.name, emailOrPhone: newUser.emailOrPhone, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    message: 'Registration successful! Welcome to TuitionHub.',
    token,
    user: newUser
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: 'Email/Phone and password are required.' });
  }

  const cleanEmail = emailOrPhone.trim().toLowerCase();

  // 1. Try finding in Render PostgreSQL
  try {
    const dbUser = await prisma.user.findUnique({
      where: { emailOrPhone: cleanEmail },
      include: {
        student: { include: { grade: true } },
        teacher: true
      }
    });

    if (dbUser) {
      const isMatch = await bcrypt.compare(password, dbUser.passwordHash);
      if (isMatch) {
        const token = jwt.sign(
          { 
            id: dbUser.id, 
            name: dbUser.name, 
            emailOrPhone: dbUser.emailOrPhone, 
            role: dbUser.role 
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          message: 'Login successful (Authenticated with Render PostgreSQL)',
          token,
          user: formatUserResponse(dbUser)
        });
      }
    }
  } catch (err) {
    console.warn('Prisma login notice:', err.message);
  }

  // 2. Fallback to demo users
  const user = DEMO_USERS.find(
    u => u.emailOrPhone.toLowerCase() === cleanEmail
  );

  if (!user) {
    return res.status(401).json({ error: 'User not found. Check your email or use a demo account.' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid password. Please try again.' });
  }

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
      qualification: user.qualification,
      designation: user.designation,
      bankAccount: user.bankAccount,
      schoolName: user.schoolName
    }
  });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        student: { include: { grade: true } },
        teacher: true
      }
    });

    if (dbUser) {
      return res.json({ user: formatUserResponse(dbUser) });
    }
  } catch (err) {
    console.warn('Prisma getMe notice:', err.message);
  }

  const user = DEMO_USERS.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  return res.json({ user });
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  const { 
    name, 
    phone, 
    parentName, 
    parentPhone, 
    subject, 
    qualification, 
    schoolName, 
    bankAccount,
    designation
  } = req.body;

  try {
    const updatedDb = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name: name.trim() })
      },
      include: {
        student: { include: { grade: true } },
        teacher: true
      }
    });

    if (updatedDb) {
      return res.json({
        message: 'Profile updated successfully in Render PostgreSQL!',
        user: formatUserResponse(updatedDb)
      });
    }
  } catch (err) {
    console.warn('Prisma updateProfile notice:', err.message);
  }

  const userIndex = DEMO_USERS.findIndex(u => u.id === req.user.id);
  if (userIndex !== -1) {
    if (name) DEMO_USERS[userIndex].name = name.trim();
    if (phone) DEMO_USERS[userIndex].phone = phone.trim();
    if (parentName) DEMO_USERS[userIndex].parentName = parentName.trim();
    if (parentPhone) DEMO_USERS[userIndex].parentPhone = parentPhone.trim();
    if (subject) DEMO_USERS[userIndex].subject = subject.trim();
    if (qualification) DEMO_USERS[userIndex].qualification = qualification.trim();
    if (schoolName) DEMO_USERS[userIndex].schoolName = schoolName.trim();
    if (bankAccount) DEMO_USERS[userIndex].bankAccount = bankAccount.trim();
    if (designation) DEMO_USERS[userIndex].designation = designation.trim();

    return res.json({
      message: 'Profile updated successfully!',
      user: DEMO_USERS[userIndex]
    });
  }

  return res.status(404).json({ error: 'User profile not found.' });
};

// GET /api/auth/demo-users
const getDemoUsers = (req, res) => {
  return res.json({
    demoAccounts: [
      { role: 'ADMIN', email: 'admin@tuition.com', password: 'admin123', label: 'Admin Console' },
      { role: 'TEACHER', email: 'teacher@tuition.com', password: 'teacher123', label: 'Teacher Portal' },
      { role: 'STUDENT', email: 'student@tuition.com', password: 'student123', label: 'Student Portal' }
    ],
    invitationCodes: {
      teacher: 'TUTOR-2026-INVITE',
      admin: 'ADMIN-SUPER-2026'
    }
  });
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  getDemoUsers
};
