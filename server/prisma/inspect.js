const prisma = require('../src/prisma');

async function inspect() {
  console.log('\n================ 👥 USERS IN DATABASE ================');
  const users = await prisma.user.findMany({
    select: { id: true, name: true, emailOrPhone: true, role: true }
  });
  console.table(users);

  console.log('\n================ 🏷️ GRADE RATE CARDS ================');
  const grades = await prisma.grade.findMany({
    select: { id: true, name: true, studentHourlyRate: true, teacherHourlyRate: true }
  });
  console.table(grades);

  console.log('\n================ 📅 SESSIONS & CLASS LOGS ================');
  const sessions = await prisma.session.findMany({
    include: {
      student: { include: { user: true, grade: true } },
      teacher: { include: { user: true } },
      classLog: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedSessions = sessions.map(s => ({
    Subject: s.subject,
    Status: s.status,
    Teacher: s.teacher?.user?.name,
    Student: s.student?.user?.name,
    Rate: `₹${s.savedStudentRate}/hr`,
    LinkOpened: s.studentLinkOpenedAt ? new Date(s.studentLinkOpenedAt).toLocaleTimeString() : 'Not opened',
    Duration: s.classLog ? `${s.classLog.durationMinutes} mins (${s.classLog.durationHours} hrs)` : 'Pending',
    Attendance: s.classLog ? s.classLog.attendanceStatus : 'PENDING',
    FeeCharged: s.classLog ? `₹${s.classLog.billableAmount}` : '₹0'
  }));
  console.table(formattedSessions);

  await prisma.$disconnect();
}

inspect().catch(console.error);

