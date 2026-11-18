const prisma = require('../prisma');

// In-memory cache for fast UI response
let ATTENDANCE_RECORDS = {};

// POST /api/attendance/join
// Records telemetry directly on Session when student or teacher clicks "Join Google Meet"
const recordJoin = async (req, res) => {
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

  // Persist directly to Session table in Render PostgreSQL
  try {
    const updateData = {};
    if (user.role === 'STUDENT') {
      updateData.studentLinkOpenedAt = now;
    } else {
      updateData.teacherLinkOpenedAt = now;
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: updateData
    });
  } catch (err) {
    // If sessionId was an in-memory ID or session not found in DB, log cleanly
    console.warn('Prisma Session link-opened update notice:', err.message);
  }

  res.status(200).json({
    message: `Meeting link opened at ${timeFormatted}. Teacher will confirm final attendance in post-class log.`,
    record
  });
};

// GET /api/attendance/session/:sessionId
const getSessionAttendance = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (session && (session.studentLinkOpenedAt || session.teacherLinkOpenedAt)) {
      const openedAt = session.studentLinkOpenedAt || session.teacherLinkOpenedAt;
      const timeFormatted = new Date(openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return res.json({
        record: {
          sessionId,
          status: 'LINK_OPENED',
          linkOpenedAt: openedAt.toISOString(),
          linkOpenedDisplay: timeFormatted,
          note: `Meeting link opened at ${timeFormatted}`
        }
      });
    }
  } catch (err) {
    console.warn('Prisma getSessionAttendance notice:', err.message);
  }

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
