const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding on Render PostgreSQL...');

  // Clean old test sessions and logs for clean, repeatable demo state
  await prisma.classLog.deleteMany({});
  await prisma.session.deleteMany({});

  // 1. Seed Grade Rate Cards (3 Tiers)
  const grade9 = await prisma.grade.upsert({
    where: { name: 'Grade 8 – 9 (Foundation)' },
    update: { studentHourlyRate: 350.0, teacherHourlyRate: 220.0 },
    create: { name: 'Grade 8 – 9 (Foundation)', studentHourlyRate: 350.0, teacherHourlyRate: 220.0 }
  });

  const grade10 = await prisma.grade.upsert({
    where: { name: 'Grade 10 (Board)' },
    update: { studentHourlyRate: 400.0, teacherHourlyRate: 250.0 },
    create: { name: 'Grade 10 (Board)', studentHourlyRate: 400.0, teacherHourlyRate: 250.0 }
  });

  const grade12 = await prisma.grade.upsert({
    where: { name: 'Grade 11 – 12 (Board / JEE)' },
    update: { studentHourlyRate: 600.0, teacherHourlyRate: 350.0 },
    create: { name: 'Grade 11 – 12 (Board / JEE)', studentHourlyRate: 600.0, teacherHourlyRate: 350.0 }
  });

  console.log('✅ Grades seeded: Grade 8-9 (₹350/₹220), Grade 10 (₹400/₹250), Grade 11-12 (₹600/₹350)');

  // 2. Seed Admin User (Managing Director Sharma)
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { emailOrPhone: 'admin@tuition.com' },
    update: { name: 'Managing Director Sharma', role: 'ADMIN', passwordHash: adminPassword },
    create: { name: 'Managing Director Sharma', emailOrPhone: 'admin@tuition.com', role: 'ADMIN', passwordHash: adminPassword }
  });
  console.log('✅ Admin account seeded:', adminUser.emailOrPhone);

  // 3. Seed Teacher 1: Mrs. Sunita Verma (Mathematics)
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const teacher1User = await prisma.user.upsert({
    where: { emailOrPhone: 'teacher@tuition.com' },
    update: { name: 'Mrs. Sunita Verma', role: 'TEACHER', passwordHash: teacherPassword },
    create: { name: 'Mrs. Sunita Verma', emailOrPhone: 'teacher@tuition.com', role: 'TEACHER', passwordHash: teacherPassword }
  });

  const teacher1Profile = await prisma.teacherProfile.upsert({
    where: { userId: teacher1User.id },
    update: {
      phone: '+91 98765 43210',
      defaultMeetLink: 'https://meet.google.com/abc-defg-hij',
      bio: 'Senior Mathematics Faculty, M.Sc. Math, B.Ed (10+ years experience)'
    },
    create: {
      userId: teacher1User.id,
      phone: '+91 98765 43210',
      defaultMeetLink: 'https://meet.google.com/abc-defg-hij',
      bio: 'Senior Mathematics Faculty, M.Sc. Math, B.Ed (10+ years experience)'
    }
  });

  // Seed Teacher 2: Dr. Amit Roy (Physics)
  const teacher2User = await prisma.user.upsert({
    where: { emailOrPhone: 'amit.roy@tuition.com' },
    update: { name: 'Dr. Amit Roy', role: 'TEACHER', passwordHash: teacherPassword },
    create: { name: 'Dr. Amit Roy', emailOrPhone: 'amit.roy@tuition.com', role: 'TEACHER', passwordHash: teacherPassword }
  });

  const teacher2Profile = await prisma.teacherProfile.upsert({
    where: { userId: teacher2User.id },
    update: {
      phone: '+91 98223 34455',
      defaultMeetLink: 'https://meet.google.com/phy-expert-class',
      bio: 'Senior Physics Faculty, Ph.D. Applied Physics, IIT Delhi alumnus (12+ years experience)'
    },
    create: {
      userId: teacher2User.id,
      phone: '+91 98223 34455',
      defaultMeetLink: 'https://meet.google.com/phy-expert-class',
      bio: 'Senior Physics Faculty, Ph.D. Applied Physics, IIT Delhi alumnus (12+ years experience)'
    }
  });
  console.log('✅ Teachers seeded: Mrs. Sunita Verma (Math), Dr. Amit Roy (Physics)');

  // 4. Seed Student 1: Aryan Sharma (Grade 10)
  const studentPassword = await bcrypt.hash('student123', 10);
  const student1User = await prisma.user.upsert({
    where: { emailOrPhone: 'student@tuition.com' },
    update: { name: 'Aryan Sharma', role: 'STUDENT', passwordHash: studentPassword },
    create: { name: 'Aryan Sharma', emailOrPhone: 'student@tuition.com', role: 'STUDENT', passwordHash: studentPassword }
  });

  const student1Profile = await prisma.studentProfile.upsert({
    where: { userId: student1User.id },
    update: { 
      gradeId: grade10.id, 
      phone: '+91 98112 23344',
      parentName: 'Mr. Rajesh Sharma',
      parentPhone: '+91 91234 56789',
      schoolName: 'Delhi Public School (CBSE)',
      address: 'B-402, Green Valley Apartments, New Delhi' 
    },
    create: { 
      userId: student1User.id, 
      gradeId: grade10.id, 
      phone: '+91 98112 23344',
      parentName: 'Mr. Rajesh Sharma',
      parentPhone: '+91 91234 56789',
      schoolName: 'Delhi Public School (CBSE)',
      address: 'B-402, Green Valley Apartments, New Delhi' 
    }
  });

  // Seed Student 2: Priya Patel (Grade 12 - Board & JEE)
  const student2User = await prisma.user.upsert({
    where: { emailOrPhone: 'priya@tuition.com' },
    update: { name: 'Priya Patel', role: 'STUDENT', passwordHash: studentPassword },
    create: { name: 'Priya Patel', emailOrPhone: 'priya@tuition.com', role: 'STUDENT', passwordHash: studentPassword }
  });

  const student2Profile = await prisma.studentProfile.upsert({
    where: { userId: student2User.id },
    update: { 
      gradeId: grade12.id, 
      phone: '+91 98987 65432',
      parentName: 'Mrs. Neeta Patel',
      parentPhone: '+91 98987 00000',
      schoolName: 'Heritage International School',
      address: 'Flat 12A, Cyber City Towers, Gurugram' 
    },
    create: { 
      userId: student2User.id, 
      gradeId: grade12.id, 
      phone: '+91 98987 65432',
      parentName: 'Mrs. Neeta Patel',
      parentPhone: '+91 98987 00000',
      schoolName: 'Heritage International School',
      address: 'Flat 12A, Cyber City Towers, Gurugram' 
    }
  });

  // Seed Student 3: Rohan Gupta (Grade 9 Foundation)
  const student3User = await prisma.user.upsert({
    where: { emailOrPhone: 'rohan@tuition.com' },
    update: { name: 'Rohan Gupta', role: 'STUDENT', passwordHash: studentPassword },
    create: { name: 'Rohan Gupta', emailOrPhone: 'rohan@tuition.com', role: 'STUDENT', passwordHash: studentPassword }
  });

  const student3Profile = await prisma.studentProfile.upsert({
    where: { userId: student3User.id },
    update: { 
      gradeId: grade9.id, 
      phone: '+91 97766 55443',
      parentName: 'Mr. Sunil Gupta',
      parentPhone: '+91 97766 00000',
      schoolName: 'St. Mary Convent High School',
      address: 'House 56, Sector 14, Noida' 
    },
    create: { 
      userId: student3User.id, 
      gradeId: grade9.id, 
      phone: '+91 97766 55443',
      parentName: 'Mr. Sunil Gupta',
      parentPhone: '+91 97766 00000',
      schoolName: 'St. Mary Convent High School',
      address: 'House 56, Sector 14, Noida' 
    }
  });
  console.log('✅ Students seeded: Aryan Sharma (Gr 10), Priya Patel (Gr 12), Rohan Gupta (Gr 9)');

  // 5. Seed Test Sessions Covering All Edge Cases
  const now = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Case 1: Aryan Sharma - Confirmed PRESENT (75 min @ ₹400/hr = ₹500 fee, ₹312.50 payout)
  await prisma.session.create({
    data: {
      teacherId: teacher1Profile.id,
      studentId: student1Profile.id,
      subject: 'Mathematics',
      scheduledStart: new Date(yesterday.setHours(17, 0, 0, 0)),
      scheduledEnd: new Date(yesterday.setHours(18, 15, 0, 0)),
      meetLink: 'https://meet.google.com/abc-defg-hij',
      recordingUrl: 'https://www.youtube.com/watch?v=ZBalWWHY4Go',
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
          confirmationRemarks: 'Student participated actively and solved practice questions.',
          billableAmount: 500.0, // 1.25 hrs * ₹400
          teacherPayoutAmount: 312.5
        }
      }
    }
  });

  // Case 2: Aryan Sharma - Confirmed ABSENT / Cancelled (Strict zero fee: 0 min, ₹0 fee)
  await prisma.session.create({
    data: {
      teacherId: teacher1Profile.id,
      studentId: student1Profile.id,
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
          topicsCovered: 'Cancelled - Student reported viral fever',
          attendanceStatus: 'ABSENT',
          confirmedAt: new Date(twoDaysAgo.setHours(16, 10, 0, 0)),
          confirmedBy: 'Mrs. Sunita Verma',
          confirmationRemarks: 'Parent informed teacher prior to class; rescheduled to weekend.',
          billableAmount: 0.0,
          teacherPayoutAmount: 0.0
        }
      }
    }
  });

  // Case 3: Priya Patel - Confirmed PRESENT (90 min @ ₹600/hr = ₹900 fee, ₹525 payout)
  await prisma.session.create({
    data: {
      teacherId: teacher2Profile.id,
      studentId: student2Profile.id,
      subject: 'Physics - Ray Optics & Laser Wavefronts',
      scheduledStart: new Date(yesterday.setHours(15, 30, 0, 0)),
      scheduledEnd: new Date(yesterday.setHours(17, 0, 0, 0)),
      meetLink: 'https://meet.google.com/phy-expert-class',
      status: 'COMPLETED',
      studentLinkOpenedAt: new Date(yesterday.setHours(15, 29, 0, 0)),
      teacherLinkOpenedAt: new Date(yesterday.setHours(15, 28, 40, 0)),
      savedStudentRate: 600.0,
      savedTeacherRate: 350.0,
      classLog: {
        create: {
          classDate: yesterday,
          startTime: new Date(yesterday.setHours(15, 30, 0, 0)),
          endTime: new Date(yesterday.setHours(17, 0, 0, 0)),
          durationMinutes: 90,
          durationHours: 1.5,
          topicsCovered: 'Ray Optics: Refraction at spherical surfaces, Lens Maker formula, Prism deviation.',
          attendanceStatus: 'PRESENT',
          confirmedAt: new Date(yesterday.setHours(17, 05, 0, 0)),
          confirmedBy: 'Dr. Amit Roy',
          confirmationRemarks: 'Excellent numerical problem solving on JEE Advanced level questions.',
          billableAmount: 900.0, // 1.5 hrs * ₹600
          teacherPayoutAmount: 525.0 // 1.5 hrs * ₹350
        }
      }
    }
  });

  // Case 4: Rohan Gupta - Confirmed PRESENT (60 min @ ₹350/hr = ₹350 fee, ₹220 payout)
  await prisma.session.create({
    data: {
      teacherId: teacher1Profile.id,
      studentId: student3Profile.id,
      subject: 'Mathematics - Linear Equations',
      scheduledStart: new Date(threeDaysAgo.setHours(18, 0, 0, 0)),
      scheduledEnd: new Date(threeDaysAgo.setHours(19, 0, 0, 0)),
      meetLink: 'https://meet.google.com/abc-defg-hij',
      recordingUrl: 'https://www.youtube.com/watch?v=ZBalWWHY4Go',
      status: 'COMPLETED',
      studentLinkOpenedAt: new Date(threeDaysAgo.setHours(17, 59, 10, 0)),
      savedStudentRate: 350.0,
      savedTeacherRate: 220.0,
      classLog: {
        create: {
          classDate: threeDaysAgo,
          startTime: new Date(threeDaysAgo.setHours(18, 0, 0, 0)),
          endTime: new Date(threeDaysAgo.setHours(19, 0, 0, 0)),
          durationMinutes: 60,
          durationHours: 1.0,
          topicsCovered: 'Linear Equations in Two Variables: Graphical representation & intercepts.',
          attendanceStatus: 'PRESENT',
          confirmedAt: new Date(threeDaysAgo.setHours(19, 02, 0, 0)),
          confirmedBy: 'Mrs. Sunita Verma',
          confirmationRemarks: 'Concept cleared. Homework practice assigned.',
          billableAmount: 350.0,
          teacherPayoutAmount: 220.0
        }
      }
    }
  });

  // Case 5: Aryan Sharma - Upcoming Class Today (Link Opened 10 min ago, Telemetry Active)
  await prisma.session.create({
    data: {
      teacherId: teacher1Profile.id,
      studentId: student1Profile.id,
      subject: 'Mathematics - Trigonometry Applications',
      scheduledStart: new Date(now.getTime() - 15 * 60 * 1000), // Started 15m ago
      scheduledEnd: new Date(now.getTime() + 45 * 60 * 1000), // Ends in 45m
      meetLink: 'https://meet.google.com/abc-defg-hij',
      status: 'SCHEDULED',
      studentLinkOpenedAt: new Date(now.getTime() - 12 * 60 * 1000), // Clicked join 12m ago
      savedStudentRate: 400.0,
      savedTeacherRate: 250.0
    }
  });

  // Case 6: Priya Patel - Upcoming Advanced Physics Class Tomorrow
  await prisma.session.create({
    data: {
      teacherId: teacher2Profile.id,
      studentId: student2Profile.id,
      subject: 'Physics - Electromagnetic Waves',
      scheduledStart: new Date(tomorrow.setHours(16, 0, 0, 0)),
      scheduledEnd: new Date(tomorrow.setHours(17, 30, 0, 0)),
      meetLink: 'https://meet.google.com/phy-expert-class',
      status: 'SCHEDULED',
      savedStudentRate: 600.0,
      savedTeacherRate: 350.0
    }
  });

  console.log('✅ Seeded 6 comprehensive test sessions across all 3 grades & edge cases!');
  console.log('🎉 Database seeding completed successfully on Render PostgreSQL!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
