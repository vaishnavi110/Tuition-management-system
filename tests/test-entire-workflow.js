const http = require('http');

const API_BASE = 'http://localhost:5000/api';

// Helper for making HTTP requests
function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const postData = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) }),
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const req = http.request(options, (res) => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
        try {
          const json = rawData ? JSON.parse(rawData) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: rawData });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTestSuite() {
  console.log('===============================================================');
  console.log('🧪 RUNNING COMPREHENSIVE END-TO-END WORKFLOW VERIFICATION SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Backend & Database Health Check
    // -------------------------------------------------------------------------
    console.log('--- 1. API & Render Database Connectivity ---');
    const demoRes = await request('GET', '/auth/demo-users');
    assert(demoRes.status === 200, 'Demo users API responds with HTTP 200');
    assert(demoRes.data.demoAccounts && demoRes.data.demoAccounts.length >= 3, 'Demo accounts available for Admin, Teacher, Student');
    assert(demoRes.data.invitationCodes.teacher === 'TUTOR-2026-INVITE', 'Staff invitation codes properly configured');

    // -------------------------------------------------------------------------
    // TEST 2: Student Authentication & Dashboard Journey
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Student Workflow (Aryan Sharma - Grade 10) ---');
    const studentLogin = await request('POST', '/auth/login', {
      emailOrPhone: 'student@tuition.com',
      password: 'student123'
    });
    assert(studentLogin.status === 200, 'Student logs in successfully with Render PostgreSQL');
    const studentToken = studentLogin.data.token;
    assert(Boolean(studentToken), 'JWT token issued for student');
    assert(studentLogin.data.user.role === 'STUDENT', 'User role correctly identified as STUDENT');
    assert(studentLogin.data.user.hourlyRate === 400, 'Student rate snapshot defaults to ₹400/hr (Grade 10)');

    // Fetch sessions
    const studentSessions = await request('GET', '/schedule/sessions', null, studentToken);
    assert(studentSessions.status === 200, 'Student sessions fetched successfully');
    assert(studentSessions.data.sessions.length > 0, 'Student has assigned class sessions');

    // Test Google Meet Telemetry Logging
    const testSession = studentSessions.data.sessions[0];
    const telemetryRes = await request('POST', '/attendance/join', { sessionId: testSession.id }, studentToken);
    assert(telemetryRes.status === 200, 'Meeting link click logs telemetry');
    assert(telemetryRes.data.record.status === 'LINK_OPENED', 'Telemetry status recorded as LINK_OPENED');
    assert(Boolean(telemetryRes.data.record.linkOpenedAt), 'Telemetry timestamp accurately captured');

    // Test Billing Math & Zero-Fee for Absent
    const summaryRes = await request('GET', '/logs/monthly-summary', null, studentToken);
    assert(summaryRes.status === 200, 'Student monthly fee statement fetched successfully');
    const initialSummary = summaryRes.data.summary;
    assert(initialSummary.totalBillableHours >= 1.25, `Total billable hours accurately reflects attended classes (current: ${initialSummary.totalBillableHours} hrs)`);
    
    // Verify absent class was not billed
    const absentLog = initialSummary.logs.find(l => l.attendanceStatus === 'ABSENT' || l.isStudentPresent === false);
    if (absentLog) {
      assert(absentLog.billableHours === 0.0, 'Absent session has exactly 0.0 billable hours');
      assert(absentLog.billableAmount === 0.0, 'Absent session fee is strictly ₹0.00');
    }

    // -------------------------------------------------------------------------
    // TEST 3: Teacher Workflow (Mrs. Sunita Verma)
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Teacher Workflow (Mrs. Sunita Verma - Mathematics) ---');
    const teacherLogin = await request('POST', '/auth/login', {
      emailOrPhone: 'teacher@tuition.com',
      password: 'teacher123'
    });
    assert(teacherLogin.status === 200, 'Teacher logs in successfully');
    const teacherToken = teacherLogin.data.token;

    // Time validation test (strict HTTP 400 on endTime <= startTime)
    const invalidLog = await request('POST', '/logs/submit', {
      sessionId: testSession.id,
      startTime: '18:00',
      endTime: '17:00',
      topicsCovered: 'Invalid time test'
    }, teacherToken);
    assert(invalidLog.status === 400, 'API rejects invalid times (end time before start time) with HTTP 400');

    // Submit a valid 75-minute class log
    const validLog = await request('POST', '/logs/submit', {
      sessionId: testSession.id,
      studentId: studentLogin.data.user.id,
      studentName: 'Aryan Sharma',
      date: new Date().toISOString().split('T')[0],
      startTime: '17:00',
      endTime: '18:15',
      attendanceStatus: 'PRESENT',
      isStudentPresent: true,
      topicsCovered: 'Quadratic Equations Exercise 4.3 & Nature of Roots',
      homeworkAssigned: 'Solve Exercise 4.3 Q1-Q5 in notebook',
      confirmationRemarks: 'Attended full session with high engagement'
    }, teacherToken);

    assert(validLog.status === 201, 'Teacher post-class log submitted and persisted (HTTP 201)');
    assert(validLog.data.log.durationMinutes === 75, `Stored exact duration in minutes: 75 mins (got: ${validLog.data.log.durationMinutes})`);
    assert(validLog.data.log.durationHours === 1.25, `Calculated decimal duration: 1.25 hrs (got: ${validLog.data.log.durationHours})`);
    assert(validLog.data.log.attendanceStatus === 'PRESENT', 'Attendance confirmed as PRESENT');
    assert(validLog.data.log.billableAmount === 500.0, `Billable student fee is ₹500.00 (1.25 x ₹400) (got: ${validLog.data.log.billableAmount})`);
    assert(validLog.data.log.teacherPayoutAmount === 312.5, `Teacher payout is ₹312.50 (1.25 x ₹250) (got: ${validLog.data.log.teacherPayoutAmount})`);

    // -------------------------------------------------------------------------
    // TEST 4: Senior Teacher & Grade 12 Advanced Flow (Dr. Amit Roy & Priya Patel)
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Advanced Grade 12 Physics Workflow (Dr. Amit Roy) ---');
    const physicsLogin = await request('POST', '/auth/login', {
      emailOrPhone: 'amit.roy@tuition.com',
      password: 'teacher123'
    });
    assert(physicsLogin.status === 200, 'Dr. Amit Roy logs in successfully');
    const physicsSessions = await request('GET', '/schedule/sessions', null, physicsLogin.data.token);
    assert(physicsSessions.data.sessions.length > 0, 'Physics teacher has assigned sessions');
    const opticsSession = physicsSessions.data.sessions.find(s => s.subject.includes('Optics') || s.studentName === 'Priya Patel');
    if (opticsSession) {
      assert(opticsSession.savedStudentRate === 600, 'Grade 12 student rate snapshot is ₹600/hr');
      assert(opticsSession.savedTeacherRate === 350, 'Grade 12 teacher payout rate snapshot is ₹350/hr');
    }

    // -------------------------------------------------------------------------
    // TEST 5: Admin / Director Console & Profit Margins
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Admin & Director Console (Managing Director Sharma) ---');
    const adminLogin = await request('POST', '/auth/login', {
      emailOrPhone: 'admin@tuition.com',
      password: 'admin123'
    });
    assert(adminLogin.status === 200, 'Admin logs in successfully');
    const adminToken = adminLogin.data.token;

    const gradesRes = await request('GET', '/schedule/grades', null, adminToken);
    assert(gradesRes.status === 200, 'Grade rate cards fetched successfully');
    assert(gradesRes.data.grades.length >= 2, 'Multiple grade tiers configured');

    const gr10 = gradesRes.data.grades.find(g => g.name.includes('10'));
    const gr12 = gradesRes.data.grades.find(g => g.name.includes('12') || g.name.includes('JEE'));
    if (gr10) {
      const margin10 = gr10.studentHourlyRate - gr10.teacherHourlyRate;
      assert(margin10 === 150, `Grade 10 margin is ₹150/hr (400 - 250) (got: ₹${margin10})`);
    }
    if (gr12) {
      const margin12 = gr12.studentHourlyRate - gr12.teacherHourlyRate;
      assert(margin12 === 250, `Grade 12 margin is ₹250/hr (600 - 350) (got: ₹${margin12})`);
    }

    // -------------------------------------------------------------------------
    // TEST 6: Public Enrollment vs. Invite-Only Security
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Role Security & Onboarding Boundaries ---');
    // Public student enrollment should succeed without invite code
    const uniqueStudentEmail = `test.student.${Date.now()}@tuition.com`;
    const regStudent = await request('POST', '/auth/register', {
      name: 'Test New Student',
      emailOrPhone: uniqueStudentEmail,
      password: 'password123',
      role: 'STUDENT',
      grade: 'Grade 10 (Board)'
    });
    assert(regStudent.status === 201, 'Public student registration succeeds without invite code');

    // Teacher onboarding without invite code MUST be rejected (HTTP 403)
    const uniqueTeacherEmail = `unauthorized.tutor.${Date.now()}@tuition.com`;
    const regTeacherNoCode = await request('POST', '/auth/register', {
      name: 'Unauthorized Tutor',
      emailOrPhone: uniqueTeacherEmail,
      password: 'password123',
      role: 'TEACHER'
    });
    assert(regTeacherNoCode.status === 403, 'Teacher registration without invite code is strictly BLOCKED (HTTP 403)');

    // Teacher onboarding WITH valid invite code succeeds
    const regTeacherWithCode = await request('POST', '/auth/register', {
      name: 'Authorized Tutor',
      emailOrPhone: uniqueTeacherEmail,
      password: 'password123',
      role: 'TEACHER',
      inviteCode: 'TUTOR-2026-INVITE',
      subject: 'Chemistry'
    });
    assert(regTeacherWithCode.status === 201, 'Teacher registration with valid invite code succeeds (HTTP 201)');

    // -------------------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------------------
    console.log('\n===============================================================');
    console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('===============================================================');

    if (failed === 0) {
      console.log('🎉 ALL WORKFLOW TESTS PASSED PERFECTLY!');
      process.exit(0);
    } else {
      console.error('⚠️ SOME TESTS FAILED.');
      process.exit(1);
    }
  } catch (err) {
    console.error('💥 Test suite crashed with error:', err);
    process.exit(1);
  }
}

runTestSuite();
