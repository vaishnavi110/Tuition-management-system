// In-memory Attendance telemetry store for local MVP development
let ATTENDANCE_RECORDS = {};

// POST /api/attendance/join
// Records telemetry when student or teacher clicks "Join Google Meet"
const recordJoin = (req, res) => {
  const { sessionId } = req.body;
  const user = req.user;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required to record meeting link access.' });
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const record = {
    sessionId,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    status: 'LINK_OPENED',
    linkOpenedAt: now.toISOString(),
    linkOpenedDisplay: timeFormatted,
    note: `Meeting link opened at ${timeFormatted}`
  };

  ATTENDANCE_RECORDS[sessionId] = record;

  res.status(200).json({
    message: `Meeting link opened at ${timeFormatted}. Teacher will confirm final attendance in post-class log.`,
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
