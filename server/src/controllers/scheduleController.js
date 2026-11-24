const prisma = require('../prisma');

// In-memory fallback data store for local MVP development
let GRADES = [
  { id: 'grade-1', name: 'Grade 8 – 9', studentHourlyRate: 350, teacherHourlyRate: 220 },
  { id: 'grade-2', name: 'Grade 10 (Board)', studentHourlyRate: 400, teacherHourlyRate: 250 },
  { id: 'grade-3', name: 'Grade 11 – 12 (Board / JEE)', studentHourlyRate: 600, teacherHourlyRate: 350 }
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
    topic: 'Quadratic Equations: Factorization & Formula derivation with board PYQs.',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '17:00',
    endTime: '18:15',
    durationMinutes: 75,
    durationHours: 1.25,
    savedStudentRate: 400.0,
    savedTeacherRate: 250.0,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    recordingUrl: 'https://www.youtube.com/watch?v=ZBalWWHY4Go',
    status: 'COMPLETED'
  },
  {
    id: 'session-2',
    teacherId: 'user-teacher-1',
    teacherName: 'Mrs. Sunita Verma',
    studentId: 'user-student-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 10 (Board)',
    subject: 'Mathematics',
    topic: 'Cancelled - Student absent due to fever',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '17:00',
    durationMinutes: 0,
    durationHours: 0.0,
    savedStudentRate: 400.0,
    savedTeacherRate: 250.0,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'CANCELLED'
  },
  {
    id: 'session-3',
    teacherId: 'user-teacher-1',
    teacherName: 'Mrs. Sunita Verma',
    studentId: 'user-student-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 10 (Board)',
    subject: 'Mathematics - Trigonometry Applications',
    topic: 'Heights and Distances & Multi-step word problems',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '17:00',
    endTime: '18:00',
    durationMinutes: 60,
    durationHours: 1.0,
    savedStudentRate: 400.0,
    savedTeacherRate: 250.0,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'SCHEDULED'
  },
  {
    id: 'session-4',
    teacherId: 'user-teacher-1',
    teacherName: 'Mrs. Sunita Verma',
    studentId: 'user-student-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 10 (Board)',
    subject: 'Mathematics',
    topic: 'Quadratic Equations & Problem Solving',
    date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '17:00',
    endTime: '18:15',
    durationMinutes: 75,
    durationHours: 1.25,
    savedStudentRate: 400.0,
    savedTeacherRate: 250.0,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    recordingUrl: 'https://fathom.video/share/dEM0X1z9LaP',
    status: 'COMPLETED'
  }
];

// --- GRADE RATE CARDS ---

const getGrades = async (req, res) => {
  try {
    const dbGrades = await prisma.grade.findMany({ orderBy: { name: 'asc' } });
    if (dbGrades && dbGrades.length > 0) {
      return res.json({ grades: dbGrades });
    }
  } catch (err) {
    console.warn('Prisma getGrades notice:', err.message);
  }
  res.json({ grades: GRADES });
};

const createGrade = async (req, res) => {
  const { name, studentHourlyRate, teacherHourlyRate } = req.body;
  if (!name || !studentHourlyRate || !teacherHourlyRate) {
    return res.status(400).json({ error: 'Grade name and hourly rates are required.' });
  }

  try {
    const created = await prisma.grade.create({
      data: {
        name: name.trim(),
        studentHourlyRate: Number(studentHourlyRate),
        teacherHourlyRate: Number(teacherHourlyRate)
      }
    });
    return res.status(201).json({ message: 'Grade rate card created successfully', grade: created });
  } catch (err) {
    console.warn('Prisma createGrade notice:', err.message);
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

const updateGrade = async (req, res) => {
  const { id } = req.params;
  const { name, studentHourlyRate, teacherHourlyRate } = req.body;

  try {
    const updated = await prisma.grade.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(studentHourlyRate !== undefined && { studentHourlyRate: Number(studentHourlyRate) }),
        ...(teacherHourlyRate !== undefined && { teacherHourlyRate: Number(teacherHourlyRate) })
      }
    });
    return res.json({ message: 'Grade rate updated successfully', grade: updated });
  } catch (err) {
    console.warn('Prisma updateGrade notice:', err.message);
  }

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

const getSessions = async (req, res) => {
  const { role, id } = req.user;

  try {
    const dbSessions = await prisma.session.findMany({
      include: {
        teacher: { include: { user: true } },
        student: { include: { user: true, grade: true } },
        classLog: true
      },
      orderBy: { scheduledStart: 'desc' }
    });

    if (dbSessions && dbSessions.length > 0) {
      let filtered = dbSessions;
      if (role === 'STUDENT') {
        filtered = dbSessions.filter(s => s.student?.userId === id || s.studentId === id);
      } else if (role === 'TEACHER') {
        filtered = dbSessions.filter(s => s.teacher?.userId === id || s.teacherId === id);
      }

      const formatted = filtered.map(s => {
        const start = new Date(s.scheduledStart);
        const end = new Date(s.scheduledEnd);
        const dateStr = start.toISOString().split('T')[0];
        const startStr = start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        const endStr = end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        return {
          id: s.id,
          teacherId: s.teacher?.userId || s.teacherId,
          teacherName: s.teacher?.user?.name || 'Mrs. Sunita Verma',
          studentId: s.student?.userId || s.studentId,
          studentName: s.student?.user?.name || 'Aryan Sharma',
          grade: s.student?.grade?.name || 'Grade 10 (Board)',
          subject: s.subject,
          topic: s.classLog?.topicsCovered || '1-on-1 Class Session',
          date: dateStr,
          startTime: startStr,
          endTime: endStr,
          durationMinutes: s.classLog?.durationMinutes || 60,
          durationHours: s.classLog?.durationHours || 1.0,
          meetLink: s.meetLink,
          recordingUrl: s.recordingUrl || null,
          status: s.status,
          studentLinkOpenedAt: s.studentLinkOpenedAt,
          teacherLinkOpenedAt: s.teacherLinkOpenedAt,
          savedStudentRate: s.savedStudentRate,
          savedTeacherRate: s.savedTeacherRate,
          classLog: s.classLog
        };
      });

      return res.json({ sessions: formatted });
    }
  } catch (err) {
    console.warn('Prisma getSessions notice:', err.message);
  }

  let filtered = SESSIONS;
  if (role === 'STUDENT') {
    filtered = SESSIONS.filter(s => s.studentId === id || s.studentName === req.user?.name || (req.user?.emailOrPhone && req.user.emailOrPhone.toLowerCase().includes('student')));
  } else if (role === 'TEACHER') {
    filtered = SESSIONS.filter(s => s.teacherId === id || s.teacherName === req.user?.name || (req.user?.emailOrPhone && req.user.emailOrPhone.toLowerCase().includes('teacher')));
  }

  res.json({ sessions: filtered });
};

// GET /api/schedule/students
// Returns enrolled students for session scheduling
const getEnrolledStudents = async (req, res) => {
  try {
    const students = await prisma.studentProfile.findMany({
      include: {
        user: true,
        grade: true
      },
      orderBy: { user: { name: 'asc' } }
    });

    if (students && students.length > 0) {
      const formatted = students.map(s => ({
        id: s.id,
        userId: s.userId,
        name: s.user?.name || 'Enrolled Student',
        email: s.user?.emailOrPhone || '',
        phone: s.phone || s.user?.phone || '',
        grade: s.grade?.name || 'Grade 10 (Board)',
        hourlyRate: s.grade?.studentHourlyRate || 400
      }));
      return res.json({ students: formatted });
    }
  } catch (err) {
    console.warn('Prisma getEnrolledStudents notice:', err.message);
  }

  res.json({
    students: [
      { id: 'user-student-1', userId: 'user-student-1', name: 'Aryan Sharma', grade: 'Grade 10 (Board)', hourlyRate: 400 },
      { id: 'user-student-2', userId: 'user-student-2', name: 'Priya Patel', grade: 'Grade 12 (Board)', hourlyRate: 600 },
      { id: 'user-student-3', userId: 'user-student-3', name: 'Rohan Gupta', grade: 'Grade 8 – 9', hourlyRate: 350 }
    ]
  });
};

const createSession = async (req, res) => {
  const { studentName, studentId, subject, topic, date, startTime, endTime, meetLink } = req.body;

  if ((!studentName && !studentId) || !subject || !date || !startTime || !endTime) {
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

  // Try creating in Render PostgreSQL
  try {
    const teacherProf = await prisma.teacherProfile.findFirst({
      where: { userId: req.user.id }
    }) || await prisma.teacherProfile.findFirst();

    // Dynamically find target student
    let studentProf = null;
    if (studentId) {
      studentProf = await prisma.studentProfile.findFirst({
        where: { OR: [{ id: studentId }, { userId: studentId }] },
        include: { grade: true, user: true }
      });
    }
    if (!studentProf && studentName) {
      studentProf = await prisma.studentProfile.findFirst({
        where: { user: { name: { equals: studentName.trim(), mode: 'insensitive' } } },
        include: { grade: true, user: true }
      });
    }
    if (!studentProf) {
      studentProf = await prisma.studentProfile.findFirst({
        include: { grade: true, user: true }
      });
    }

    if (teacherProf && studentProf) {
      const startDateTime = new Date(`${date}T${startTime}:00`);
      const endDateTime = new Date(`${date}T${endTime}:00`);

      const created = await prisma.session.create({
        data: {
          teacherId: teacherProf.id,
          studentId: studentProf.id,
          subject: subject.trim(),
          scheduledStart: startDateTime,
          scheduledEnd: endDateTime,
          meetLink: meetLink && meetLink.trim() ? meetLink.trim() : 'https://meet.google.com/new',
          status: 'SCHEDULED',
          savedStudentRate: studentProf.grade?.studentHourlyRate || 400.0,
          savedTeacherRate: studentProf.grade?.teacherHourlyRate || 250.0
        },
        include: {
          teacher: { include: { user: true } },
          student: { include: { user: true, grade: true } }
        }
      });

      const formatted = {
        id: created.id,
        teacherId: created.teacher?.userId,
        teacherName: created.teacher?.user?.name || req.user.name,
        studentId: created.student?.userId,
        studentName: created.student?.user?.name || studentName?.trim() || 'Student',
        grade: created.student?.grade?.name || 'Grade 10 (Board)',
        subject: created.subject,
        topic: topic ? topic.trim() : '1-on-1 Class Session',
        date,
        startTime,
        endTime,
        durationMinutes,
        durationHours,
        meetLink: created.meetLink,
        status: created.status,
        savedStudentRate: created.savedStudentRate,
        savedTeacherRate: created.savedTeacherRate
      };

      SESSIONS.unshift(formatted);
      return res.status(201).json({ message: '1-on-1 Class scheduled successfully', session: formatted });
    }
  } catch (err) {
    console.warn('Prisma createSession notice:', err.message);
  }

  const newSession = {
    id: `session-${Date.now()}`,
    teacherId: req.user.id,
    teacherName: req.user.name,
    studentId: studentId || 'user-student-1',
    studentName: studentName ? studentName.trim() : 'Enrolled Student',
    grade: 'Grade 10 (Board)',
    subject: subject.trim(),
    topic: topic ? topic.trim() : 'General Class',
    date,
    startTime,
    endTime,
    durationMinutes,
    durationHours,
    savedStudentRate: 400.0,
    savedTeacherRate: 250.0,
    meetLink: meetLink && meetLink.trim() ? meetLink.trim() : 'https://meet.google.com/new',
    status: 'SCHEDULED'
  };

  SESSIONS.unshift(newSession);
  res.status(201).json({ message: '1-on-1 Class scheduled successfully', session: newSession });
};

const rescheduleSession = async (req, res) => {
  const { id } = req.params;
  const { date, startTime, endTime, meetLink } = req.body;

  const effectiveStart = startTime || '17:00';
  const effectiveEnd = endTime || '18:00';
  const [startH, startM] = effectiveStart.split(':').map(Number);
  const [endH, endM] = effectiveEnd.split(':').map(Number);
  const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);

  if (isNaN(durationMinutes) || durationMinutes <= 0) {
    return res.status(400).json({ 
      error: 'Invalid class time: End time must be strictly later than start time.' 
    });
  }

  try {
    const updateData = {};
    if (meetLink) updateData.meetLink = meetLink.trim();
    if (date && startTime && endTime) {
      updateData.scheduledStart = new Date(`${date}T${startTime}:00`);
      updateData.scheduledEnd = new Date(`${date}T${endTime}:00`);
    }

    const updated = await prisma.session.update({
      where: { id },
      data: updateData
    });
    return res.json({ message: 'Class rescheduled successfully in Render PostgreSQL', session: updated });
  } catch (err) {
    console.warn('Prisma rescheduleSession notice:', err.message);
  }

  const session = SESSIONS.find(s => s.id === id);
  if (!session) {
    return res.status(404).json({ error: 'Class session not found.' });
  }

  if (date) session.date = date;
  if (startTime) session.startTime = startTime;
  if (endTime) session.endTime = endTime;
  session.durationMinutes = durationMinutes;
  session.durationHours = Number((durationMinutes / 60).toFixed(2));
  if (meetLink) session.meetLink = meetLink.trim();

  res.json({ message: 'Class rescheduled successfully', session });
};

const cancelSession = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await prisma.session.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });
    return res.json({ message: 'Class cancelled. As per policy, ₹0 is charged.', session: updated });
  } catch (err) {
    console.warn('Prisma cancelSession notice:', err.message);
  }

  const session = SESSIONS.find(s => s.id === id);
  if (!session) {
    return res.status(404).json({ error: 'Class session not found.' });
  }

  session.status = 'CANCELLED';
  res.json({ message: 'Class cancelled. As per policy, ₹0 is charged.', session });
};

// PATCH /api/schedule/sessions/:id/recording
const updateSessionRecording = async (req, res) => {
  const { id } = req.params;
  const { recordingUrl } = req.body;

  try {
    const updated = await prisma.session.update({
      where: { id },
      data: { recordingUrl: recordingUrl ? recordingUrl.trim() : null }
    });
    return res.json({
      success: true,
      message: 'Class recording URL updated successfully',
      session: updated
    });
  } catch (err) {
    console.warn('Prisma updateSessionRecording notice:', err.message);
  }

  const sess = SESSIONS.find(s => s.id === id);
  if (sess) {
    sess.recordingUrl = recordingUrl ? recordingUrl.trim() : null;
    return res.json({
      success: true,
      message: 'Class recording URL updated successfully',
      session: sess
    });
  }

  res.status(404).json({ error: 'Class session not found.' });
};

module.exports = {
  GRADES,
  SESSIONS,
  getGrades,
  createGrade,
  updateGrade,
  getSessions,
  getEnrolledStudents,
  createSession,
  rescheduleSession,
  cancelSession,
  updateSessionRecording
};
