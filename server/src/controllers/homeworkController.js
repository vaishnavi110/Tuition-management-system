const prisma = require('../prisma');
const { SESSIONS } = require('./scheduleController');

// Sample question sheet SVG (rendered cleanly as an instant question sheet preview for demo walkthroughs)
const SAMPLE_QUESTION_SHEET_SVG = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="420" viewBox="0 0 760 420">
    <rect width="760" height="420" fill="#ffffff" rx="16"/>
    <rect x="16" y="16" width="728" height="388" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" rx="12"/>
    <text x="40" y="56" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#1e293b">Mathematics Worksheet • Grade 10 (NCERT Ex 4.2)</text>
    <line x1="40" y1="74" x2="720" y2="74" stroke="#e2e8f0" stroke-width="2"/>
    <text x="40" y="112" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#334155">Q1. Solve by factorization &amp; verify using Quadratic Formula:</text>
    <text x="64" y="144" font-family="Courier New, monospace" font-size="16" fill="#0f172a">(a) x² - 3x - 10 = 0        (b) 2x² + x - 6 = 0</text>
    <text x="40" y="196" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#334155">Q2. Find the discriminant D = b² - 4ac and nature of roots:</text>
    <text x="64" y="228" font-family="Courier New, monospace" font-size="16" fill="#0f172a">(a) 2x² - 4x + 3 = 0        (b) 3x² - 4√3x + 4 = 0</text>
    <text x="40" y="280" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#334155">Q3. Word Problem:</text>
    <text x="64" y="312" font-family="Arial, sans-serif" font-size="15" fill="#1e293b">The altitude of a right triangle is 7 cm less than its base.</text>
    <text x="64" y="336" font-family="Arial, sans-serif" font-size="15" fill="#1e293b">If the hypotenuse is 13 cm, find the other two sides.</text>
    <text x="40" y="384" font-family="Arial, sans-serif" font-size="13" fill="#64748b">Assigned by Mrs. Sunita Verma • Upload clear notebook photos before next class</text>
  </svg>`
).toString('base64')}`;

// Memory store for fallback & feedback annotations
const HOMEWORK_FEEDBACK_MAP = new Map();

let HOMEWORK_ITEMS = [
  {
    id: 'hw-1',
    sessionId: 'session-1',
    teacherId: 'user-teacher-1',
    teacherName: 'Mrs. Sunita Verma',
    studentId: 'user-student-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 10 (Board)',
    subject: 'Mathematics',
    title: 'NCERT Exercise 4.2: Quadratic Formula Applications',
    description: 'Solve Questions 1 to 3 cleanly in your practice notebook. Show steps for identifying a, b, c and calculating discriminant b² - 4ac.',
    teacherImageUrl: SAMPLE_QUESTION_SHEET_SVG,
    studentSubmissionUrl: null,
    submissionFileName: null,
    status: 'PENDING',
    teacherFeedback: null,
    submittedAt: null,
    reviewedAt: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024; // 6 MB

/**
 * Validates uploaded image/PDF payload (URL or Data URI)
 */
const validateImageInput = (rawValue) => {
  if (!rawValue || typeof rawValue !== 'string' || !rawValue.trim()) {
    return { valid: true, value: null };
  }

  const trimmed = rawValue.trim();

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/uploads/')) {
    return { valid: true, value: trimmed };
  }

  const dataUriMatch = trimmed.match(/^data:(image\/(?:jpeg|jpg|png|webp|gif|svg\+xml)|application\/pdf);base64,([A-Za-z0-9+/=\s]+)$/i);
  if (!dataUriMatch) {
    return {
      valid: false,
      error: 'Unsupported file format. Only JPG, PNG, WEBP, GIF images or PDF files are allowed.'
    };
  }

  const base64Body = dataUriMatch[2].replace(/\s/g, '');
  const approxBytes = Math.floor((base64Body.length * 3) / 4);
  if (approxBytes > MAX_UPLOAD_BYTES) {
    return {
      valid: false,
      error: 'Uploaded file exceeds the 6 MB maximum size limit. Please choose a smaller image.'
    };
  }

  return { valid: true, value: trimmed };
};

const formatDbHomework = (hw) => ({
  id: hw.id,
  sessionId: hw.sessionId,
  teacherId: hw.session?.teacher?.userId || 'user-teacher-1',
  teacherName: hw.session?.teacher?.user?.name || 'Teacher',
  studentId: hw.session?.student?.userId || 'user-student-1',
  studentName: hw.session?.student?.user?.name || 'Student',
  grade: hw.session?.student?.grade?.name || 'Grade 10',
  subject: hw.session?.subject || 'Mathematics',
  title: hw.title,
  description: hw.description || '',
  teacherImageUrl: hw.teacherImageUrl || null,
  studentSubmissionUrl: hw.studentSubmissionUrl || null,
  submissionFileName: hw.studentSubmissionUrl ? 'notebook-submission' : null,
  status: hw.status || 'PENDING',
  teacherFeedback: HOMEWORK_FEEDBACK_MAP.get(hw.id) || null,
  submittedAt: hw.submittedAt ? hw.submittedAt.toISOString() : null,
  reviewedAt: hw.reviewedAt ? hw.reviewedAt.toISOString() : null,
  createdAt: hw.createdAt ? hw.createdAt.toISOString() : new Date().toISOString()
});

// GET /api/homework
const getHomeworkList = async (req, res) => {
  const { role, id, name } = req.user;

  try {
    const dbHomeworks = await prisma.homework.findMany({
      include: {
        session: {
          include: {
            teacher: { include: { user: true } },
            student: { include: { user: true, grade: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (dbHomeworks && dbHomeworks.length > 0) {
      let formatted = dbHomeworks.map(formatDbHomework);
      if (role === 'STUDENT') {
        formatted = formatted.filter(h => h.studentId === id || (name && h.studentName.toLowerCase().includes(name.toLowerCase())));
      } else if (role === 'TEACHER') {
        formatted = formatted.filter(h => h.teacherId === id || (name && h.teacherName.toLowerCase().includes(name.toLowerCase())));
      }
      return res.json({ success: true, homeworks: formatted });
    }
  } catch (err) {
    console.warn('Prisma getHomeworkList notice:', err.message);
  }

  let items = HOMEWORK_ITEMS;
  if (role === 'STUDENT') {
    items = HOMEWORK_ITEMS.filter(h => h.studentId === id || (name && h.studentName.toLowerCase().includes(name.toLowerCase())));
  } else if (role === 'TEACHER') {
    items = HOMEWORK_ITEMS.filter(h => h.teacherId === id || (name && h.teacherName.toLowerCase().includes(name.toLowerCase())));
  }

  res.json({ success: true, homeworks: items });
};

// POST /api/homework
// Teacher creates homework assignment & optionally attaches question sheet photo
const createHomework = async (req, res) => {
  const { sessionId, title, description, teacherImageData, teacherImageUrl, studentName, subject } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Homework title is required' });
  }

  const rawImage = teacherImageData || teacherImageUrl || null;
  const validation = validateImageInput(rawImage);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    let targetSession = null;
    if (sessionId) {
      targetSession = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
          teacher: { include: { user: true } },
          student: { include: { user: true, grade: true } }
        }
      });
    }
    if (!targetSession) {
      targetSession = await prisma.session.findFirst({
        include: {
          teacher: { include: { user: true } },
          student: { include: { user: true, grade: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    if (targetSession) {
      const created = await prisma.homework.create({
        data: {
          sessionId: targetSession.id,
          title: title.trim(),
          description: description ? description.trim() : null,
          teacherImageUrl: validation.value,
          status: 'PENDING'
        },
        include: {
          session: {
            include: {
              teacher: { include: { user: true } },
              student: { include: { user: true, grade: true } }
            }
          }
        }
      });

      const formatted = formatDbHomework(created);
      HOMEWORK_ITEMS.unshift(formatted);
      return res.status(201).json({
        success: true,
        message: 'Homework assignment posted successfully.',
        homework: formatted
      });
    }
  } catch (err) {
    console.warn('Prisma createHomework notice:', err.message);
  }

  // Fallback to in-memory store
  const memSession = SESSIONS.find(s => s.id === sessionId) || SESSIONS[0] || {};
  const newHomework = {
    id: `hw-${Date.now()}`,
    sessionId: sessionId || memSession.id || 'session-1',
    teacherId: req.user.id,
    teacherName: req.user.name,
    studentId: memSession.studentId || 'user-student-1',
    studentName: studentName || memSession.studentName || 'Aryan Sharma',
    grade: memSession.grade || 'Grade 10 (Board)',
    subject: subject || memSession.subject || 'Mathematics',
    title: title.trim(),
    description: description ? description.trim() : '',
    teacherImageUrl: validation.value,
    studentSubmissionUrl: null,
    submissionFileName: null,
    status: 'PENDING',
    teacherFeedback: null,
    submittedAt: null,
    reviewedAt: null,
    createdAt: new Date().toISOString()
  };

  HOMEWORK_ITEMS.unshift(newHomework);
  res.status(201).json({
    success: true,
    message: 'Homework assignment posted successfully.',
    homework: newHomework
  });
};

// POST /api/homework/:id/submit
// Student uploads photo of completed notebook pages
const submitHomeworkSolution = async (req, res) => {
  const { id } = req.params;
  const { imageData, studentSubmissionUrl, fileName } = req.body;

  const rawSubmission = imageData || studentSubmissionUrl;
  if (!rawSubmission || !String(rawSubmission).trim()) {
    return res.status(400).json({ error: 'Please select a notebook photo or PDF to submit.' });
  }

  const validation = validateImageInput(rawSubmission);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const existing = await prisma.homework.findUnique({ where: { id } });
    if (existing) {
      const updated = await prisma.homework.update({
        where: { id },
        data: {
          studentSubmissionUrl: validation.value,
          status: 'SUBMITTED',
          submittedAt: new Date()
        },
        include: {
          session: {
            include: {
              teacher: { include: { user: true } },
              student: { include: { user: true, grade: true } }
            }
          }
        }
      });

      const formatted = formatDbHomework(updated);
      if (fileName) formatted.submissionFileName = fileName;

      const memIdx = HOMEWORK_ITEMS.findIndex(h => h.id === id);
      if (memIdx !== -1) HOMEWORK_ITEMS[memIdx] = formatted;
      else HOMEWORK_ITEMS.unshift(formatted);

      return res.json({
        success: true,
        message: 'Notebook submission uploaded for teacher review.',
        homework: formatted
      });
    }
  } catch (err) {
    console.warn('Prisma submitHomeworkSolution notice:', err.message);
  }

  const target = HOMEWORK_ITEMS.find(h => h.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Homework assignment not found' });
  }

  target.studentSubmissionUrl = validation.value;
  target.submissionFileName = fileName || 'notebook-photo.png';
  target.status = 'SUBMITTED';
  target.submittedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Notebook submission uploaded for teacher review.',
    homework: target
  });
};

// PATCH /api/homework/:id/review
// Teacher inspects student submission and marks it REVIEWED (or requests revision)
const reviewHomeworkSubmission = async (req, res) => {
  const { id } = req.params;
  const { status = 'REVIEWED', feedback } = req.body;

  const normalizedStatus = status === 'PENDING' ? 'PENDING' : 'REVIEWED';
  if (feedback !== undefined) {
    HOMEWORK_FEEDBACK_MAP.set(id, String(feedback).trim());
  }

  try {
    const existing = await prisma.homework.findUnique({ where: { id } });
    if (existing) {
      const updated = await prisma.homework.update({
        where: { id },
        data: {
          status: normalizedStatus,
          reviewedAt: normalizedStatus === 'REVIEWED' ? new Date() : null
        },
        include: {
          session: {
            include: {
              teacher: { include: { user: true } },
              student: { include: { user: true, grade: true } }
            }
          }
        }
      });

      const formatted = formatDbHomework(updated);
      const memIdx = HOMEWORK_ITEMS.findIndex(h => h.id === id);
      if (memIdx !== -1) HOMEWORK_ITEMS[memIdx] = formatted;

      return res.json({
        success: true,
        message: normalizedStatus === 'REVIEWED' ? 'Submission marked as reviewed.' : 'Returned for revision.',
        homework: formatted
      });
    }
  } catch (err) {
    console.warn('Prisma reviewHomeworkSubmission notice:', err.message);
  }

  const target = HOMEWORK_ITEMS.find(h => h.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Homework assignment not found' });
  }

  target.status = normalizedStatus;
  target.reviewedAt = normalizedStatus === 'REVIEWED' ? new Date().toISOString() : null;
  if (feedback !== undefined) {
    target.teacherFeedback = String(feedback).trim();
  }

  res.json({
    success: true,
    message: normalizedStatus === 'REVIEWED' ? 'Submission marked as reviewed.' : 'Returned for revision.',
    homework: target
  });
};

// DELETE /api/homework/:id/submission
// Student removes/withdraws an unreviewed notebook submission
const removeHomeworkSubmission = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.homework.findUnique({ where: { id } });
    if (existing) {
      if (existing.status === 'REVIEWED') {
        return res.status(400).json({ error: 'Cannot remove a submission that has already been reviewed.' });
      }
      const updated = await prisma.homework.update({
        where: { id },
        data: {
          studentSubmissionUrl: null,
          status: 'PENDING',
          submittedAt: null
        },
        include: {
          session: {
            include: {
              teacher: { include: { user: true } },
              student: { include: { user: true, grade: true } }
            }
          }
        }
      });

      const formatted = formatDbHomework(updated);
      formatted.submissionFileName = null;
      const memIdx = HOMEWORK_ITEMS.findIndex(h => h.id === id);
      if (memIdx !== -1) HOMEWORK_ITEMS[memIdx] = formatted;

      return res.json({
        success: true,
        message: 'Homework submission removed.',
        homework: formatted
      });
    }
  } catch (err) {
    console.warn('Prisma removeHomeworkSubmission notice:', err.message);
  }

  const target = HOMEWORK_ITEMS.find(h => h.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Homework assignment not found' });
  }
  if (target.status === 'REVIEWED') {
    return res.status(400).json({ error: 'Cannot remove a submission that has already been reviewed.' });
  }

  target.studentSubmissionUrl = null;
  target.submissionFileName = null;
  target.status = 'PENDING';
  target.submittedAt = null;

  res.json({
    success: true,
    message: 'Homework submission removed.',
    homework: target
  });
};

module.exports = {
  getHomeworkList,
  createHomework,
  submitHomeworkSolution,
  reviewHomeworkSubmission,
  removeHomeworkSubmission
};
