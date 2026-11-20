const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const prisma = require('../prisma');
const inviteService = require('../services/inviteService');

// Valid academy invitation codes for controlled staff onboarding
const VALID_TEACHER_INVITES = inviteService.STATIC_TEACHER_CODES;
const VALID_ADMIN_INVITES = inviteService.STATIC_ADMIN_CODES;

// Strict Email Validation (Standard RFC 5322 compliant)
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

// Strict Mobile Number Validation (10 digits starting with 6-9, optional +91 or 0 prefix)
const isValidPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(\+91|0)?[6-9]\d{9}$/.test(cleaned);
};

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

// Helper to format user for client responses (dynamically extracts profile metadata)
const formatUserResponse = (user) => {
  return {
    id: user.id,
    name: user.name,
    emailOrPhone: user.emailOrPhone,
    role: user.role,
    grade: user.student?.grade?.name || user.grade || (user.role === 'STUDENT' ? 'Grade 10 (Board)' : undefined),
    hourlyRate: user.student?.grade?.studentHourlyRate || (user.role === 'TEACHER' ? 250 : 400),
    subject: user.teacher?.subject || user.subject || (user.role === 'TEACHER' ? 'General Faculty' : undefined),
    phone: user.teacher?.phone || user.student?.phone || user.phone || '',
    parentName: user.student?.parentName || user.parentName || (user.role === 'STUDENT' ? '' : undefined),
    parentPhone: user.student?.parentPhone || user.parentPhone || (user.role === 'STUDENT' ? '' : undefined),
    schoolName: user.student?.schoolName || user.schoolName || (user.role === 'STUDENT' ? '' : undefined),
    qualification: user.teacher?.qualification || user.teacher?.bio || user.qualification || (user.role === 'TEACHER' ? 'Senior Faculty' : undefined),
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

  // 1. Mandatory input checks
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Full name is required.' });
  }

  if (!emailOrPhone || !emailOrPhone.trim()) {
    return res.status(400).json({ error: 'Email address or mobile number is required.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  // 2. Strict Email / Phone validation
  const cleanIdentifier = emailOrPhone.trim();
  const isEmail = cleanIdentifier.includes('@');
  if (isEmail) {
    if (!isValidEmail(cleanIdentifier)) {
      return res.status(400).json({ 
        error: 'Please enter a valid email address (e.g. name@gmail.com).' 
      });
    }
  } else {
    if (!isValidPhoneNumber(cleanIdentifier)) {
      return res.status(400).json({ 
        error: 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9 (e.g. 9876543210).' 
      });
    }
  }

  // 3. Role-based onboarding security checks (Invite Code Gatekeeper)
  const normalizedRole = role.toUpperCase();
  let assignedSubjectFromInvite = null;

  if (normalizedRole === 'TEACHER' || normalizedRole === 'ADMIN') {
    const inviteResult = inviteService.validateAndRedeemInvite(
      inviteCode,
      normalizedRole,
      cleanIdentifier,
      name ? name.trim() : null
    );

    if (!inviteResult.valid) {
      return res.status(403).json({ 
        error: inviteResult.error || (normalizedRole === 'TEACHER' 
          ? 'Teacher registration is strictly by authorized invitation only. Please enter a valid Tutor Invitation Code issued by the Academy Director.' 
          : 'Administrative registration is strictly restricted. Please provide a valid Master Academy Authorization Key.')
      });
    }

    if (inviteResult.subject) {
      assignedSubjectFromInvite = inviteResult.subject;
    }
  }

  // 4. Strict validation on contact numbers if provided
  if (phone && phone.trim() && !isValidPhoneNumber(phone)) {
    return res.status(400).json({ 
      error: 'Invalid mobile contact number. Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.' 
    });
  }

  // Teacher mobile phone is mandatory
  if (normalizedRole === 'TEACHER' && (!phone || !phone.trim() || !isValidPhoneNumber(phone.trim()))) {
    return res.status(400).json({
      error: 'Teacher mobile contact number is mandatory and must be a valid 10-digit number.'
    });
  }

  if (parentPhone && parentPhone.trim() && !isValidPhoneNumber(parentPhone)) {
    return res.status(400).json({ 
      error: 'Invalid parent/guardian mobile number. Please enter a valid 10-digit mobile number.' 
    });
  }

  const cleanEmail = cleanIdentifier.toLowerCase();
  const effectivePhone = phone ? phone.trim() : (!isEmail ? cleanIdentifier : null);

  // 5. Check duplicate & persist to Render PostgreSQL
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
        phone: effectivePhone,
        role: normalizedRole,
        passwordHash,
        ...(normalizedRole === 'STUDENT' && defaultGrade ? {
          student: {
            create: {
              gradeId: defaultGrade.id,
              phone: effectivePhone,
              parentName: parentName ? parentName.trim() : null,
              parentPhone: parentPhone ? parentPhone.trim() : null,
              schoolName: schoolName ? schoolName.trim() : null,
              address: 'Registered Online'
            }
          }
        } : {}),
        ...(normalizedRole === 'TEACHER' ? {
          teacher: {
            create: {
              subject: subject ? subject.trim() : (assignedSubjectFromInvite || 'General Studies'),
              qualification: qualification ? qualification.trim() : 'Senior Faculty',
              phone: effectivePhone,
              bio: qualification ? qualification.trim() : 'Senior Faculty',
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
    subject: subject || (normalizedRole === 'TEACHER' ? (assignedSubjectFromInvite || 'Mathematics') : undefined),
    phone: effectivePhone || '',
    parentName: parentName ? parentName.trim() : '',
    parentPhone: parentPhone ? parentPhone.trim() : '',
    schoolName: schoolName ? schoolName.trim() : '',
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

  const cleanIdentifier = emailOrPhone.trim();
  const isEmail = cleanIdentifier.includes('@');
  if (isEmail && !isValidEmail(cleanIdentifier)) {
    return res.status(400).json({ error: 'Please enter a valid email address (e.g. name@gmail.com).' });
  }

  const cleanEmail = cleanIdentifier.toLowerCase();

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
      phone: user.phone || '',
      parentName: user.parentName || '',
      parentPhone: user.parentPhone || '',
      qualification: user.qualification,
      designation: user.designation,
      bankAccount: user.bankAccount,
      schoolName: user.schoolName || ''
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

  // Validate phone numbers if updated
  if (phone && phone.trim() && !isValidPhoneNumber(phone)) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }
  if (parentPhone && parentPhone.trim() && !isValidPhoneNumber(parentPhone)) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit parent mobile number.' });
  }

  try {
    const isStudent = req.user.role === 'STUDENT';
    const isTeacher = req.user.role === 'TEACHER';

    const updatedDb = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(phone && { phone: phone.trim() }),
        ...(isStudent ? {
          student: {
            update: {
              ...(parentName !== undefined && { parentName: parentName ? parentName.trim() : null }),
              ...(parentPhone !== undefined && { parentPhone: parentPhone ? parentPhone.trim() : null }),
              ...(schoolName !== undefined && { schoolName: schoolName ? schoolName.trim() : null }),
              ...(phone !== undefined && { phone: phone ? phone.trim() : null })
            }
          }
        } : {}),
        ...(isTeacher ? {
          teacher: {
            update: {
              ...(phone && { phone: phone.trim() }),
              ...(subject && { subject: subject.trim() }),
              ...(qualification && { 
                qualification: qualification.trim(),
                bio: qualification.trim() 
              })
            }
          }
        } : {})
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
  isValidEmail,
  isValidPhoneNumber,
  register,
  login,
  getMe,
  updateProfile,
  getDemoUsers
};
