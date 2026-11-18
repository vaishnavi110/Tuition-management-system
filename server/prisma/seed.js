const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding on Render PostgreSQL...');

  // 1. Seed or update Grade Rate Cards
  const grade10 = await prisma.grade.upsert({
    where: { name: 'Grade 10 (Board)' },
    update: {
      studentHourlyRate: 400.0,
      teacherHourlyRate: 250.0
    },
    create: {
      name: 'Grade 10 (Board)',
      studentHourlyRate: 400.0,
      teacherHourlyRate: 250.0
    }
  });

  const grade12 = await prisma.grade.upsert({
    where: { name: 'Grade 11 – 12 (Board / JEE)' },
    update: {
      studentHourlyRate: 600.0,
      teacherHourlyRate: 350.0
    },
    create: {
      name: 'Grade 11 – 12 (Board / JEE)',
      studentHourlyRate: 600.0,
      teacherHourlyRate: 350.0
    }
  });

  console.log('✅ Grades seeded:', grade10.name, grade12.name);

  // 2. Seed Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { emailOrPhone: 'admin@tuition.com' },
    update: {
      name: 'Managing Director Sharma',
      role: 'ADMIN',
      passwordHash: adminPassword
    },
    create: {
      name: 'Managing Director Sharma',
      emailOrPhone: 'admin@tuition.com',
      role: 'ADMIN',
      passwordHash: adminPassword
    }
  });
  console.log('✅ Admin account seeded:', adminUser.emailOrPhone);

  // 3. Seed Teacher User & Profile
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const teacherUser = await prisma.user.upsert({
    where: { emailOrPhone: 'teacher@tuition.com' },
    update: {
      name: 'Mrs. Sunita Verma',
      role: 'TEACHER',
      passwordHash: teacherPassword
    },
    create: {
      name: 'Mrs. Sunita Verma',
      emailOrPhone: 'teacher@tuition.com',
      role: 'TEACHER',
      passwordHash: teacherPassword
    }
  });

  const teacherProfile = await prisma.teacherProfile.upsert({
    where: { userId: teacherUser.id },
    update: {
      phone: '+91 98765 43210',
      defaultMeetLink: 'https://meet.google.com/abc-defg-hij',
      bio: 'Senior Mathematics Faculty, M.Sc. Math, B.Ed (10+ years experience)'
    },
    create: {
      userId: teacherUser.id,
      phone: '+91 98765 43210',
      defaultMeetLink: 'https://meet.google.com/abc-defg-hij',
      bio: 'Senior Mathematics Faculty, M.Sc. Math, B.Ed (10+ years experience)'
    }
  });
  console.log('✅ Teacher account & profile seeded:', teacherUser.emailOrPhone);

  // 4. Seed Student User & Profile (Aarav Sharma - Grade 10)
  const studentPassword = await bcrypt.hash('student123', 10);
  const studentUser = await prisma.user.upsert({
    where: { emailOrPhone: 'student@tuition.com' },
    update: {
      name: 'Aryan Sharma',
      role: 'STUDENT',
      passwordHash: studentPassword
    },
    create: {
      name: 'Aryan Sharma',
      emailOrPhone: 'student@tuition.com',
      role: 'STUDENT',
      passwordHash: studentPassword
    }
  });

  const studentProfile = await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {
      gradeId: grade10.id,
      parentPhone: '+91 91234 56789',
      address: 'B-402, Green Valley Apartments, New Delhi'
    },
    create: {
      userId: studentUser.id,
      gradeId: grade10.id,
      parentPhone: '+91 91234 56789',
      address: 'B-402, Green Valley Apartments, New Delhi'
    }
  });
  console.log('✅ Student account & profile seeded:', studentUser.emailOrPhone);

  // 5. Seed Demonstration Sessions
  const now = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Session A: Confirmed PRESENT (75 min, ₹500 fee, ₹312.50 payout)
  const session1 = await prisma.session.create({
    data: {
      teacherId: teacherProfile.id,
      studentId: studentProfile.id,
      subject: 'Mathematics',
      scheduledStart: new Date(yesterday.setHours(17, 0, 0, 0)),
      scheduledEnd: new Date(yesterday.setHours(18, 15, 0, 0)),
      meetLink: 'https://meet.google.com/abc-defg-hij',
      status: 'COMPLETED',
      studentLinkOpenedAt: new Date(yesterday.setHours(16, 58, 20, 0)),
      teacherLinkOpenedAt: new Date(yesterday.setHours(16, 59, 10, 0)),
      savedStudentRate: 400.0,
      savedTeacherRate: 250.0,
      classLog: {
        create: {
          classDate: yesterday,
          startTime: new Date(yesterday.setHours(17, 0, 0, 0)),
          endTime: new Date(yesterday.setHours(18, 15, 0, 0)),
          durationMinutes: 75,
          durationHours: 1.25,
          topicsCovered: 'Quadratic Equations: Factorization & Formula derivation with board PYQs.',
          attendanceStatus: 'PRESENT',
          confirmedAt: new Date(yesterday.setHours(18, 20, 0, 0)),
          confirmedBy: 'Mrs. Sunita Verma',
          confirmationRemarks: 'Student participated actively and completed practice problems.',
          billableAmount: 500.0, // 1.25 hrs * ₹400
          teacherPayoutAmount: 312.5 // 1.25 hrs * ₹250
        }
      }
    }
  });
  console.log('✅ Seeded Session 1 (Confirmed PRESENT): 75 min -> ₹500.00 billable');

  // Session B: Confirmed ABSENT / Cancelled (0 min, ₹0 fee, ₹0 payout)
  const session2 = await prisma.session.create({
    data: {
      teacherId: teacherProfile.id,
      studentId: studentProfile.id,
      subject: 'Mathematics',
      scheduledStart: new Date(twoDaysAgo.setHours(16, 0, 0, 0)),
      scheduledEnd: new Date(twoDaysAgo.setHours(17, 0, 0, 0)),
      meetLink: 'https://meet.google.com/abc-defg-hij',
      status: 'CANCELLED',
      savedStudentRate: 400.0,
      savedTeacherRate: 250.0,
      classLog: {
        create: {
          classDate: twoDaysAgo,
          startTime: new Date(twoDaysAgo.setHours(16, 0, 0, 0)),
          endTime: new Date(twoDaysAgo.setHours(16, 0, 0, 0)),
          durationMinutes: 0,
          durationHours: 0.0,
          topicsCovered: 'Cancelled - Student absent due to fever',
          attendanceStatus: 'ABSENT',
          confirmedAt: new Date(twoDaysAgo.setHours(16, 10, 0, 0)),
          confirmedBy: 'Mrs. Sunita Verma',
          confirmationRemarks: 'Parent informed teacher prior to class; student sick. Rescheduling.',
          billableAmount: 0.0, // Strict zero fee
          teacherPayoutAmount: 0.0
        }
      }
    }
  });
  console.log('✅ Seeded Session 2 (Confirmed ABSENT): 0 min -> ₹0 fee');

  // Session C: Scheduled Upcoming (PENDING attendance)
  const session3 = await prisma.session.create({
    data: {
      teacherId: teacherProfile.id,
      studentId: studentProfile.id,
      subject: 'Mathematics - Trigonometry Applications',
      scheduledStart: new Date(tomorrow.setHours(17, 0, 0, 0)),
      scheduledEnd: new Date(tomorrow.setHours(18, 0, 0, 0)),
      meetLink: 'https://meet.google.com/abc-defg-hij',
      status: 'SCHEDULED',
      savedStudentRate: 400.0,
      savedTeacherRate: 250.0
    }
  });
  console.log('✅ Seeded Session 3 (Upcoming SCHEDULED): Pending link-open and attendance');

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

