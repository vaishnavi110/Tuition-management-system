// In-memory Class Logs store for local MVP development
const { SESSIONS } = require('./scheduleController');

let CLASS_LOGS = [
  {
    id: 'log-1',
    sessionId: 'session-past-1',
    teacherId: 'user-teacher-1',
    teacherName: 'Mrs. Sunita Verma',
    studentId: 'user-student-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 10 (Board)',
    subject: 'Mathematics',
    date: '2026-11-12',
    startTime: '17:00',
    endTime: '18:00',
    durationHours: 1.0,
    isStudentPresent: true,
    billableHours: 1.0,
    topicsCovered: 'Linear Equations in Two Variables: Substitution & Elimination Methods.',
    homeworkAssigned: 'NCERT Ex 3.3 Questions 1-5 in notebook.',
    createdAt: '2026-11-12T18:05:00.000Z'
  },
  {
    id: 'log-2',
    sessionId: 'session-past-2',
    teacherId: 'user-teacher-1',
    teacherName: 'Mrs. Sunita Verma',
    studentId: 'user-student-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 10 (Board)',
    subject: 'Mathematics',
    date: '2026-11-14',
    startTime: '17:00',
    endTime: '18:30',
    durationHours: 1.5,
    isStudentPresent: true,
    billableHours: 1.5,
    topicsCovered: 'Quadratic Equations: Factorization & Quadratic Formula derivation.',
    homeworkAssigned: 'Solve 10 board exam PYQs on Quadratic Formula.',
    createdAt: '2026-11-14T18:32:00.000Z'
  },
  {
    id: 'log-3',
    sessionId: 'session-past-3',
    teacherId: 'user-teacher-1',
    teacherName: 'Mrs. Sunita Verma',
    studentId: 'user-student-2',
    studentName: 'Priya Patel',
    grade: 'Grade 12 (Board)',
    subject: 'Calculus',
    date: '2026-11-15',
    startTime: '16:00',
    endTime: '17:00',
    durationHours: 1.0,
    isStudentPresent: true,
    billableHours: 1.0,
    topicsCovered: 'Definite Integrals: Properties of definite integrals with trig substitutions.',
    homeworkAssigned: 'Exercise 7.11 complete.',
    createdAt: '2026-11-15T17:04:00.000Z'
  }
];

// Helper to calculate exact decimal hours between two HH:MM strings
const calculateDurationHours = (startTime, endTime) => {
  if (!startTime || !endTime) return 1.0;
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  let diffMinutes = endMinutes - startMinutes;
  if (diffMinutes <= 0) diffMinutes = 60; // Default to 1 hour minimum

  return Number((diffMinutes / 60).toFixed(1));
};

// POST /api/logs/submit
// Teacher submits post-class details immediately after session
const submitClassLog = (req, res) => {
  const {
    sessionId,
    studentId,
    studentName,
    grade,
    subject,
    date,
    startTime,
    endTime,
    isStudentPresent,
    topicsCovered,
    homeworkAssigned
  } = req.body;

  if (!startTime || !endTime || !topicsCovered) {
    return res.status(400).json({ error: 'Start time, end time, and topics covered are mandatory.' });
  }

  const rawDuration = calculateDurationHours(startTime, endTime);
  // Strict Academy Rule: If student was absent or class cancelled, 0 billable hours charged
  const billableHours = isStudentPresent ? rawDuration : 0.0;

  const newLog = {
    id: `log-${Date.now()}`,
    sessionId: sessionId || `session-${Date.now()}`,
    teacherId: req.user.id,
    teacherName: req.user.name,
    studentId: studentId || 'user-student-1',
    studentName: studentName || 'Aryan Sharma',
    grade: grade || 'Grade 10 (Board)',
    subject: subject || 'Mathematics',
    date: date || new Date().toISOString().split('T')[0],
    startTime,
    endTime,
    durationHours: rawDuration,
    isStudentPresent: Boolean(isStudentPresent),
    billableHours,
    topicsCovered: topicsCovered.trim(),
    homeworkAssigned: homeworkAssigned ? homeworkAssigned.trim() : 'No homework assigned',
    createdAt: new Date().toISOString()
  };

  CLASS_LOGS.unshift(newLog);

  res.status(201).json({
    message: 'Post-class details logged successfully! Hours verified for billing.',
    log: newLog
  });
};

// GET /api/logs/monthly-summary
// Dynamic running monthly metrics based on user role
const getMonthlySummary = (req, res) => {
  const { role, id } = req.user;

  let userLogs = CLASS_LOGS;
  if (role === 'STUDENT') {
    userLogs = CLASS_LOGS.filter(l => l.studentId === id || l.studentName.includes('Aryan'));
  } else if (role === 'TEACHER') {
    userLogs = CLASS_LOGS.filter(l => l.teacherId === id || l.teacherName.includes('Sunita'));
  }

  const totalBillableHours = userLogs.reduce((acc, log) => acc + (log.billableHours || 0), 0);
  const totalClassesCount = userLogs.length;

  res.json({
    summary: {
      totalBillableHours: Number(totalBillableHours.toFixed(1)),
      totalClassesCount,
      logs: userLogs
    }
  });
};

// GET /api/logs/all
const getAllLogs = (req, res) => {
  res.json({ logs: CLASS_LOGS });
};

module.exports = {
  submitClassLog,
  getMonthlySummary,
  getAllLogs
};
