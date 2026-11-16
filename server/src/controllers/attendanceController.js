// In-memory Attendance store for local MVP development
let ATTENDANCE_RECORDS = {};

// POST /api/attendance/join
// Triggered automatically when student clicks "Join Google Meet"
const recordJoin = (req, res) => {
  const { sessionId } = req.body;
  const user = req.user;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required to record attendance.' });
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const record = {
    sessionId,
    studentId: user.id,
    studentName: user.name,
    status: 'PRESENT',
    autoDetected: true,
    joinedAt: now.toISOString(),
    joinedTimeDisplay: timeFormatted
  };

  ATTENDANCE_RECORDS[sessionId] = record;

  res.status(200).json({
    message: 'Smart Attendance logged successfully!',
    record
  });
};

// GET /api/attendance/session/:sessionId
const getSessionAttendance = (req, res) => {
  const { sessionId } = req.params;
  const record = ATTENDANCE_RECORDS[sessionId] || null;

  res.json({ record });
};

// GET /api/attendance/all
const getAllAttendance = (req, res) => {
  res.json({ attendance: ATTENDANCE_RECORDS });
};

module.exports = {
  recordJoin,
  getSessionAttendance,
  getAllAttendance
};
