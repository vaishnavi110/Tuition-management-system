require('dotenv').config();
const prisma = require('../src/prisma');

async function purgeTestAccounts() {
  console.log('--- PURGING TEST ARTIFACT ACCOUNTS FROM RENDER POSTGRESQL ---');

  // Identify test accounts by name or test email pattern
  const testUsers = await prisma.user.findMany({
    where: {
      OR: [
        { name: 'Test New Student' },
        { name: 'Authorized Tutor' },
        { name: 'Bad Phone User' },
        { name: 'Bad Email User' },
        { emailOrPhone: { contains: 'test.student.' } },
        { emailOrPhone: { contains: 'unauthorized.tutor.' } },
        { emailOrPhone: { contains: 'fresh.student.' } },
        { emailOrPhone: { contains: 'neha.sen.' } },
        { emailOrPhone: { contains: 'riddhima.joshi.' } }
      ]
    },
    select: { id: true, name: true, emailOrPhone: true, role: true }
  });

  console.log(`Found ${testUsers.length} test accounts to remove:`);
  for (const u of testUsers) {
    console.log(`- [${u.role}] ${u.name} (${u.emailOrPhone}) [ID: ${u.id}]`);
  }

  if (testUsers.length > 0) {
    const ids = testUsers.map(u => u.id);

    // Find student and teacher profile IDs
    const studentProfs = await prisma.studentProfile.findMany({
      where: { userId: { in: ids } },
      select: { id: true }
    });
    const teacherProfs = await prisma.teacherProfile.findMany({
      where: { userId: { in: ids } },
      select: { id: true }
    });

    const sIds = studentProfs.map(s => s.id);
    const tIds = teacherProfs.map(t => t.id);

    // Delete class logs linked to test sessions
    await prisma.classLog.deleteMany({
      where: {
        session: {
          OR: [
            { studentId: { in: sIds } },
            { teacherId: { in: tIds } }
          ]
        }
      }
    });

    // Delete test sessions
    await prisma.session.deleteMany({
      where: {
        OR: [
          { studentId: { in: sIds } },
          { teacherId: { in: tIds } }
        ]
      }
    });

    // Delete student and teacher profiles
    await prisma.studentProfile.deleteMany({ where: { userId: { in: ids } } });
    await prisma.teacherProfile.deleteMany({ where: { userId: { in: ids } } });

    // Finally delete users
    const deletedUsers = await prisma.user.deleteMany({
      where: { id: { in: ids } }
    });

    console.log(`✅ Successfully deleted ${deletedUsers.count} test accounts and their related sessions.`);
  } else {
    console.log('No test accounts found to delete.');
  }

  // Display remaining authentic accounts
  const remainingUsers = await prisma.user.findMany({
    include: { student: true, teacher: true },
    orderBy: { createdAt: 'desc' }
  });

  console.log('\n--- REMAINING CLEAN DATABASE USERS ---');
  console.log(`Total remaining users: ${remainingUsers.length}`);
  remainingUsers.forEach(u => {
    console.log(`• [${u.role}] ${u.name} (${u.emailOrPhone}) Phone: ${u.phone || u.student?.phone || u.teacher?.phone || 'N/A'}`);
  });
}

purgeTestAccounts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
