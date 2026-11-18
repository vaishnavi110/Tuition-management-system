// In-memory data store for local MVP development
let GRADES = [
  { id: 'grade-1', name: 'Grade 8 – 9', studentHourlyRate: 350, teacherHourlyRate: 220 },
  { id: 'grade-2', name: 'Grade 10 (Board)', studentHourlyRate: 400, teacherHourlyRate: 250 },
  { id: 'grade-3', name: 'Grade 11 – 12 (JEE/NEET)', studentHourlyRate: 600, teacherHourlyRate: 350 }
];

let SESSIONS = [
  {
    id: 'session-1',
    teacherId: 'user-teacher-1',
    teacherName: 'Mrs. Sunita Verma',
    studentId: 'user-student-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 10 (Board)',
    subject: 'Mathematics',
    topic: 'Quadratic Equations (Chapter 4)',
    date: new Date().toISOString().split('T')[0], // Today
    startTime: '17:00',
    endTime: '18:15',
    durationMinutes: 75,
    durationHours: 1.25,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'SCHEDULED' // SCHEDULED | COMPLETED | CANCELLED
  },
  {
    id: 'session-2',
    teacherId: 'user-teacher-1',
    teacherName: 'Mrs. Sunita Verma',
    studentId: 'user-student-2',
    studentName: 'Priya Patel',
    grade: 'Grade 12 (Board)',
    subject: 'Calculus',
    topic: 'Integration by Parts',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    startTime: '16:00',
    endTime: '17:00',
    durationMinutes: 60,
    durationHours: 1.0,
    meetLink: 'https://meet.google.com/xyz-uvwx-rst',
    status: 'SCHEDULED'
  }
];

// --- GRADE RATE CARDS ---

const getGrades = (req, res) => {
  res.json({ grades: GRADES });
};

const createGrade = (req, res) => {
  const { name, studentHourlyRate, teacherHourlyRate } = req.body;
  if (!name || !studentHourlyRate || !teacherHourlyRate) {
    return res.status(400).json({ error: 'Grade name and hourly rates are required.' });
  }

  const newGrade = {
    id: `grade-${Date.now()}`,
    name: name.trim(),
    studentHourlyRate: Number(studentHourlyRate),
    teacherHourlyRate: Number(teacherHourlyRate)
  };

  GRADES.push(newGrade);
  res.status(201).json({ message: 'Grade rate card created successfully', grade: newGrade });
};

const updateGrade = (req, res) => {
  const { id } = req.params;
  const { name, studentHourlyRate, teacherHourlyRate } = req.body;

  const index = GRADES.findIndex(g => g.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Grade not found.' });
  }

  if (name) GRADES[index].name = name.trim();
  if (studentHourlyRate !== undefined) GRADES[index].studentHourlyRate = Number(studentHourlyRate);
  if (teacherHourlyRate !== undefined) GRADES[index].teacherHourlyRate = Number(teacherHourlyRate);

  res.json({ message: 'Grade rate updated successfully', grade: GRADES[index] });
};

// --- 1-ON-1 SESSIONS SCHEDULING ---

const getSessions = (req, res) => {
  const { role, id } = req.user;

  let filtered = SESSIONS;
  if (role === 'STUDENT') {
    filtered = SESSIONS.filter(s => s.studentId === id);
  } else if (role === 'TEACHER') {
    filtered = SESSIONS.filter(s => s.teacherId === id);
  }

  res.json({ sessions: filtered });
};

const createSession = (req, res) => {
  const { studentName, subject, topic, date, startTime, endTime, meetLink } = req.body;

  if (!studentName || !subject || !date || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required session fields.' });
  }

  // Calculate duration in exact minutes and strictly validate
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);

  if (isNaN(durationMinutes) || durationMinutes <= 0) {
    return res.status(400).json({ 
      error: 'Invalid class time: End time must be strictly later than start time.' 
    });
  }

  const durationHours = Number((durationMinutes / 60).toFixed(2));

  const newSession = {
    id: `session-${Date.now()}`,
    teacherId: req.user.id,
    teacherName: req.user.name,
    studentId: 'user-student-1',
    studentName: studentName.trim(),
    grade: 'Grade 10 (Board)',
    subject: subject.trim(),
    topic: topic ? topic.trim() : 'General Class',
    date,
    startTime,
    endTime,
    durationMinutes,
    durationHours,
    meetLink: meetLink && meetLink.trim() ? meetLink.trim() : 'https://meet.google.com/new',
    status: 'SCHEDULED'
  };

  SESSIONS.unshift(newSession);
  res.status(201).json({ message: '1-on-1 Class scheduled successfully', session: newSession });
};

const rescheduleSession = (req, res) => {
  const { id } = req.params;
  const { date, startTime, endTime, meetLink } = req.body;

  const session = SESSIONS.find(s => s.id === id);
  if (!session) {
    return res.status(404).json({ error: 'Class session not found.' });
  }

  const effectiveStart = startTime || session.startTime;
  const effectiveEnd = endTime || session.endTime;
  const [startH, startM] = effectiveStart.split(':').map(Number);
  const [endH, endM] = effectiveEnd.split(':').map(Number);
  const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);

  if (isNaN(durationMinutes) || durationMinutes <= 0) {
    return res.status(400).json({ 
      error: 'Invalid class time: End time must be strictly later than start time.' 
    });
  }

  if (date) session.date = date;
  if (startTime) session.startTime = startTime;
  if (endTime) session.endTime = endTime;
  session.durationMinutes = durationMinutes;
  session.durationHours = Number((durationMinutes / 60).toFixed(2));
  if (meetLink) session.meetLink = meetLink.trim();

  res.json({ message: 'Class rescheduled successfully', session });
};

const cancelSession = (req, res) => {
  const { id } = req.params;

  const session = SESSIONS.find(s => s.id === id);
  if (!session) {
    return res.status(404).json({ error: 'Class session not found.' });
  }

  session.status = 'CANCELLED';
  res.json({ message: 'Class cancelled. As per policy, ₹0 is charged.', session });
};

module.exports = {
  GRADES,
  SESSIONS,
  getGrades,
  createGrade,
  updateGrade,
  getSessions,
  createSession,
  rescheduleSession,
  cancelSession
};

