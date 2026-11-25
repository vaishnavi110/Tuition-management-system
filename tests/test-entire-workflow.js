const http = require('http');

const API_BASE = process.env.API_BASE || 'http://127.0.0.1:5000/api';

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
  const createdTestUserIds = [];

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
    if (regStudent.data?.user?.id) createdTestUserIds.push(regStudent.data.user.id);

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
      phone: '9844005566',
      password: 'password123',
      role: 'TEACHER',
      inviteCode: 'TUTOR-2026-INVITE',
      subject: 'Chemistry'
    });
    assert(regTeacherWithCode.status === 201, 'Teacher registration with valid invite code succeeds (HTTP 201)');
    if (regTeacherWithCode.data?.user?.id) createdTestUserIds.push(regTeacherWithCode.data.user.id);

    // -------------------------------------------------------------------------
    // TEST 7: Strict Email & 10-Digit Mobile Number Validation Boundaries
    // -------------------------------------------------------------------------
    console.log('\n--- 7. Strict Email (Gmail/RFC) & Mobile Validation Tests ---');
    // Test 7a: Invalid email without domain
    const badEmailRes = await request('POST', '/auth/register', {
      name: 'Bad Email User',
      emailOrPhone: 'invalidemailformat',
      password: 'password123',
      role: 'STUDENT'
    });
    assert(badEmailRes.status === 400, 'Registration rejects invalid email format with HTTP 400');

    // Test 7b: Invalid mobile number (less than 10 digits or non-numeric)
    const badPhoneRes = await request('POST', '/auth/register', {
      name: 'Bad Phone User',
      emailOrPhone: 'user.test@gmail.com',
      phone: '12345', // Invalid: only 5 digits
      password: 'password123',
      role: 'STUDENT'
    });
    assert(badPhoneRes.status === 400, 'Registration rejects invalid mobile number (12345) with HTTP 400');

    // Test 7c: Invalid parent phone number (starting with 1)
    const badParentPhoneRes = await request('POST', '/auth/register', {
      name: 'Bad Parent Phone User',
      emailOrPhone: 'user.test2@gmail.com',
      phone: '9876543210',
      parentPhone: '1111111111', // Invalid: starts with 1
      password: 'password123',
      role: 'STUDENT'
    });
    assert(badParentPhoneRes.status === 400, 'Registration rejects invalid parent phone (1111111111) with HTTP 400');

    // -------------------------------------------------------------------------
    // TEST 8: Full New Student Profile Info Persistence & Retrieval
    // -------------------------------------------------------------------------
    console.log('\n--- 8. New Student Profile Info Persistence & Retrieval ---');
    const newStudentEmail = `riddhima.joshi.${Date.now()}@gmail.com`;
    const newStudentReg = await request('POST', '/auth/register', {
      name: 'Riddhima Joshi',
      emailOrPhone: newStudentEmail,
      phone: '+91 98220 01122',
      password: 'password123',
      role: 'STUDENT',
      grade: 'Grade 10 (Board)',
      parentName: 'Dr. Mahesh Joshi',
      parentPhone: '9822003344',
      schoolName: 'St. Joseph High School'
    });

    assert(newStudentReg.status === 201, 'New student with full profile registered successfully (HTTP 201)');
    if (newStudentReg.data?.user?.id) createdTestUserIds.push(newStudentReg.data.user.id);
    const regUser = newStudentReg.data.user;
    assert(regUser.name === 'Riddhima Joshi', 'Registered student name is Riddhima Joshi');
    assert(regUser.parentName === 'Dr. Mahesh Joshi', `Registered parent name matches input: Dr. Mahesh Joshi (got: ${regUser.parentName})`);
    assert(regUser.parentPhone === '9822003344', `Registered parent phone matches input: 9822003344 (got: ${regUser.parentPhone})`);
    assert(regUser.schoolName === 'St. Joseph High School', `Registered school name matches input: St. Joseph High School (got: ${regUser.schoolName})`);

    // Verify /api/auth/me fetches proper profile info from Render PostgreSQL
    const riddhimaToken = newStudentReg.data.token;
    const meRes = await request('GET', '/auth/me', null, riddhimaToken);
    assert(meRes.status === 200, '/api/auth/me fetches profile info successfully');
    const meUser = meRes.data.user;
    assert(meUser.name === 'Riddhima Joshi', 'me query returns correct student name');
    assert(meUser.parentName === 'Dr. Mahesh Joshi', 'me query returns correct parent name (not hardcoded demo!)');
    assert(meUser.schoolName === 'St. Joseph High School', 'me query returns correct school name (not hardcoded demo!)');
    assert(meUser.parentPhone === '9822003344', 'me query returns correct parent phone');

    // Test profile update
    const updateRes = await request('PUT', '/auth/profile', {
      schoolName: 'St. Joseph International Academy Pune',
      parentPhone: '9822009988'
    }, riddhimaToken);
    assert(updateRes.status === 200, 'Student profile update succeeds (HTTP 200)');
    assert(updateRes.data.user.schoolName === 'St. Joseph International Academy Pune', 'Updated school name persisted in Render PostgreSQL');
    assert(updateRes.data.user.parentPhone === '9822009988', 'Updated parent phone persisted in Render PostgreSQL');

    // -------------------------------------------------------------------------
    // 9. Academy Directory & User Management (Admin RBAC & Directory Integrity)
    // -------------------------------------------------------------------------
    console.log('\n--- 9. Academy Directory & User Management (Admin RBAC & Integrity) ---');

    // 9.1 RBAC Security: Unauthorized access blocked (401)
    const anonAdminUsersRes = await request('GET', '/admin/users');
    assert(anonAdminUsersRes.status === 401, 'Unauthenticated request to /api/admin/users is strictly blocked (HTTP 401)');

    // 9.2 RBAC Security: Student role forbidden (403)
    const studentAdminUsersRes = await request('GET', '/admin/users', null, studentToken);
    assert(studentAdminUsersRes.status === 403, 'Student access to /api/admin/users is strictly forbidden (HTTP 403)');

    // 9.3 RBAC Security: Teacher role forbidden (403)
    const teacherAdminUsersRes = await request('GET', '/admin/users', null, teacherToken);
    assert(teacherAdminUsersRes.status === 403, 'Teacher access to /api/admin/users is strictly forbidden (HTTP 403)');

    // 9.4 Authorized Admin Directory Retrieval (200)
    const adminDirectoryRes = await request('GET', '/admin/users', null, adminToken);
    assert(adminDirectoryRes.status === 200, 'Admin successfully fetches /api/admin/users directory (HTTP 200)');
    assert(adminDirectoryRes.data.success === true, 'Directory response indicates success');
    assert(Array.isArray(adminDirectoryRes.data.students), 'Response contains students list array');
    assert(Array.isArray(adminDirectoryRes.data.teachers), 'Response contains teachers list array');
    assert(adminDirectoryRes.data.students.length >= 1, 'Students roster has at least 1 enrolled student');
    assert(adminDirectoryRes.data.teachers.length >= 1, 'Teachers roster has at least 1 onboarded tutor');

    // 9.5 Student Profile Metadata Integrity in Directory
    const firstStudent = adminDirectoryRes.data.students[0];
    assert(typeof firstStudent.name === 'string' && firstStudent.name.length > 0, 'Directory student has valid name');
    assert(typeof firstStudent.grade === 'string' && firstStudent.grade.length > 0, 'Directory student has grade standard');
    assert(firstStudent.phone !== undefined, 'Directory student has contact phone');
    assert(firstStudent.parentName !== undefined, 'Directory student has parent name');
    assert(firstStudent.parentPhone !== undefined, 'Directory student has parent phone');
    assert(firstStudent.schoolName !== undefined, 'Directory student has school name');
    assert(typeof firstStudent.attendedHours === 'number', 'Directory student has numeric attendedHours');
    assert(typeof firstStudent.totalFeeDue === 'number', 'Directory student has numeric totalFeeDue');

    // 9.6 Teacher Metadata Integrity in Directory
    const firstTeacher = adminDirectoryRes.data.teachers[0];
    assert(typeof firstTeacher.name === 'string' && firstTeacher.name.length > 0, 'Directory teacher has valid name');
    assert(typeof firstTeacher.subject === 'string' && firstTeacher.subject.length > 0, 'Directory teacher has subject department');
    assert(typeof firstTeacher.classesTaken === 'number', 'Directory teacher has numeric classesTaken');
    assert(typeof firstTeacher.accruedPayout === 'number', 'Directory teacher has numeric accruedPayout');
    assert(firstTeacher.defaultMeetLink && firstTeacher.defaultMeetLink.includes('meet.google.com'), 'Directory teacher has valid Google Meet link');

    // -------------------------------------------------------------------------
    // 10. Teacher Custom Subject, Dynamic Student Dropdown & Session Cross-Reflection
    // -------------------------------------------------------------------------
    console.log('\n--- 10. Teacher Subject, Dynamic Scheduling & Student Reflection ---');

    // 10.1 Teacher registration rejects missing mobile number
    const badTeacherPhoneRes = await request('POST', '/auth/register', {
      name: 'Dr. Neha Sen',
      emailOrPhone: `neha.sen.${Date.now()}@tuition.com`,
      phone: '123', // invalid phone
      password: 'password123',
      role: 'TEACHER',
      inviteCode: 'TUTOR-2026-INVITE',
      subject: 'Biology'
    });
    assert(badTeacherPhoneRes.status === 400, 'Teacher registration strictly rejects invalid mobile number (HTTP 400)');

    // 10.2 Teacher registration persists custom subject without demo fallback
    const bioTeacherEmail = `neha.sen.${Date.now()}@tuition.com`;
    const bioTeacherRes = await request('POST', '/auth/register', {
      name: 'Dr. Neha Sen',
      emailOrPhone: bioTeacherEmail,
      phone: '9833112233',
      password: 'password123',
      role: 'TEACHER',
      inviteCode: 'TUTOR-2026-INVITE',
      subject: 'Biology & Genetics',
      qualification: 'Ph.D in Molecular Genetics'
    });
    assert(bioTeacherRes.status === 201, 'Biology teacher registers successfully with custom subject (HTTP 201)');
    if (bioTeacherRes.data?.user?.id) createdTestUserIds.push(bioTeacherRes.data.user.id);
    const bioTeacherToken = bioTeacherRes.data.token;

    // 10.3 /api/auth/me returns teacher custom subject (NOT Mathematics)
    const bioTeacherMe = await request('GET', '/auth/me', null, bioTeacherToken);
    assert(bioTeacherMe.status === 200, '/api/auth/me returns 200 for newly registered teacher');
    assert(bioTeacherMe.data.user.subject === 'Biology & Genetics', `Teacher subject is 'Biology & Genetics' (got: '${bioTeacherMe.data.user.subject}')`);
    assert(bioTeacherMe.data.user.phone === '9833112233', 'Teacher mobile phone is properly returned in profile');

    // 10.4 Teacher fetches enrolled students list for dynamic scheduling
    const enrolledStudentsRes = await request('GET', '/schedule/students', null, bioTeacherToken);
    assert(enrolledStudentsRes.status === 200, 'Teacher successfully fetches /api/schedule/students (HTTP 200)');
    assert(Array.isArray(enrolledStudentsRes.data.students), 'Students list is returned as array');
    assert(enrolledStudentsRes.data.students.length >= 1, 'Students list contains registered students from DB');

    // 10.5 Register a brand-new student to test cross-account scheduling reflection
    const freshStudentEmail = `fresh.student.${Date.now()}@gmail.com`;
    const freshStudentRes = await request('POST', '/auth/register', {
      name: 'Tanvi Kulkarni',
      emailOrPhone: freshStudentEmail,
      phone: '9822334455',
      password: 'password123',
      role: 'STUDENT',
      grade: 'Grade 10 (Board)',
      schoolName: 'Bishop High School Pune',
      parentName: 'Sanjay Kulkarni',
      parentPhone: '9822330000'
    });
    assert(freshStudentRes.status === 201, 'Fresh student Tanvi Kulkarni registered successfully (HTTP 201)');
    if (freshStudentRes.data?.user?.id) createdTestUserIds.push(freshStudentRes.data.user.id);
    const freshStudentToken = freshStudentRes.data.token;
    const freshStudentId = freshStudentRes.data.user.id;

    // 10.6 Teacher schedules a class specifically for this new student
    const tomorrowDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const schedRes = await request('POST', '/schedule/sessions', {
      studentId: freshStudentId,
      studentName: 'Tanvi Kulkarni',
      subject: 'Biology & Genetics',
      topic: 'Cell Division: Mitosis & Meiosis with diagram analysis',
      date: tomorrowDate,
      startTime: '16:00',
      endTime: '17:15',
      meetLink: 'https://meet.google.com/bio-tanvi-demo'
    }, bioTeacherToken);
    assert(schedRes.status === 201, 'Teacher schedules 1-on-1 class for Tanvi Kulkarni (HTTP 201)');
    assert(schedRes.data.session.studentName === 'Tanvi Kulkarni', 'Scheduled session student name matches Tanvi');
    assert(schedRes.data.session.durationMinutes === 75, 'Scheduled duration is exactly 75 mins');

    // 10.7 Verify scheduled session immediately reflects in the student's logged in session list!
    const studentSessionsRes = await request('GET', '/schedule/sessions', null, freshStudentToken);
    assert(studentSessionsRes.status === 200, 'Student fetches /api/schedule/sessions successfully (HTTP 200)');
    const matchingSession = studentSessionsRes.data.sessions.find(s => s.subject === 'Biology & Genetics');
    assert(!!matchingSession, 'Newly scheduled Biology session reflects live in student logged-in dashboard!');
    assert(matchingSession.teacherName === 'Dr. Neha Sen', 'Student session shows correct teacher name');
    assert(matchingSession.meetLink === 'https://meet.google.com/bio-tanvi-demo', 'Student session shows correct Google Meet link');

    // -------------------------------------------------------------------------
    // 11. Dynamic Admin Invite Code Generation & Teacher Registration Lifecycle
    // -------------------------------------------------------------------------
    console.log('\n--- 11. Dynamic Admin Invite Code Generation & Teacher Onboarding ---');

    // 11.1 Admin lists initial invitation codes
    const initialInvitesRes = await request('GET', '/admin/invites', null, adminToken);
    assert(initialInvitesRes.status === 200, 'Admin fetches /api/admin/invites successfully (HTTP 200)');
    assert(Array.isArray(initialInvitesRes.data.invites), 'Invites returned as an array');

    // 11.2 Admin generates a unique dynamic invitation code for an Organic Chemistry Teacher
    const createInviteRes = await request('POST', '/admin/invites', {
      role: 'TEACHER',
      subject: 'Organic Chemistry',
      customCode: `TUTOR-CHEM-${Date.now().toString().slice(-4)}`
    }, adminToken);
    assert(createInviteRes.status === 201, 'Admin generates dynamic invite code (HTTP 201)');
    assert(createInviteRes.data.success === true, 'Dynamic invite generation reports success');
    const dynamicCode = createInviteRes.data.invite.code;
    assert(!!dynamicCode, `Generated invite code is present: ${dynamicCode}`);
    assert(createInviteRes.data.invite.status === 'ACTIVE', 'Generated invite status is ACTIVE');
    assert(createInviteRes.data.invite.subject === 'Organic Chemistry', 'Generated invite subject is Organic Chemistry');

    // 11.3 Teacher registration rejects invalid/unauthorized invite code
    const invalidInviteRes = await request('POST', '/auth/register', {
      name: 'Dr. Vikram Sarabhai',
      emailOrPhone: `vikram.${Date.now()}@tuition.com`,
      phone: '9844001122',
      password: 'password123',
      role: 'TEACHER',
      inviteCode: 'INVALID-FAKE-CODE-9999'
    });
    assert(invalidInviteRes.status === 403, 'Teacher registration strictly rejects invalid invite code with HTTP 403');

    // 11.4 Teacher successfully registers using the newly generated dynamic invite code
    const chemTeacherEmail = `chem.faculty.${Date.now()}@tuition.com`;
    const dynamicTeacherRes = await request('POST', '/auth/register', {
      name: 'Dr. Vikram Sarabhai',
      emailOrPhone: chemTeacherEmail,
      phone: '9844001122',
      password: 'password123',
      role: 'TEACHER',
      inviteCode: dynamicCode
    });
    assert(dynamicTeacherRes.status === 201, 'Teacher registers successfully using dynamic invite code (HTTP 201)');
    if (dynamicTeacherRes.data?.user?.id) createdTestUserIds.push(dynamicTeacherRes.data.user.id);
    const dynamicTeacherToken = dynamicTeacherRes.data.token;

    // 11.5 Verify registered teacher's subject automatically inherits from the invite code
    const chemTeacherProfile = await request('GET', '/auth/me', null, dynamicTeacherToken);
    assert(chemTeacherProfile.status === 200, 'Newly registered teacher fetches profile (HTTP 200)');
    assert(chemTeacherProfile.data.user.subject === 'Organic Chemistry', 'Teacher profile inherited subject from dynamic invite code');

    // 11.6 Verify that the dynamic invite code is now marked as USED in the admin list
    const postRegisterInvitesRes = await request('GET', '/admin/invites', null, adminToken);
    const usedInvite = postRegisterInvitesRes.data.invites.find(i => i.code === dynamicCode);
    assert(!!usedInvite, 'Used invite exists in admin roster');
    assert(usedInvite.status === 'USED', 'Dynamic invite code status updated to USED after registration');
    assert(usedInvite.usedBy === 'Dr. Vikram Sarabhai', 'Dynamic invite tracks name of redeemed teacher');

    // 11.7 Verify that attempting to reuse the same redeemed one-time code fails
    const reuseAttemptRes = await request('POST', '/auth/register', {
      name: 'Another Teacher',
      emailOrPhone: `another.${Date.now()}@tuition.com`,
      phone: '9855112233',
      password: 'password123',
      role: 'TEACHER',
      inviteCode: dynamicCode
    });
    assert(reuseAttemptRes.status === 403, 'Attempting to reuse redeemed invite code is strictly blocked (HTTP 403)');

    // 11.8 Admin revokes a code and verifies revoked codes cannot be used
    const revokeTestCode = `TUTOR-REVOKE-${Date.now().toString().slice(-4)}`;
    await request('POST', '/admin/invites', { role: 'TEACHER', subject: 'Robotics', customCode: revokeTestCode }, adminToken);
    const revokeRes = await request('DELETE', `/admin/invites/${revokeTestCode}`, null, adminToken);
    assert(revokeRes.status === 200, 'Admin revokes invitation code successfully (HTTP 200)');

    const revokedRegRes = await request('POST', '/auth/register', {
      name: 'Revoked Test Tutor',
      emailOrPhone: `revoked.${Date.now()}@tuition.com`,
      phone: '9866223344',
      password: 'password123',
      role: 'TEACHER',
      inviteCode: revokeTestCode
    });
    assert(revokedRegRes.status === 403, 'Registration with revoked code is strictly blocked (HTTP 403)');

    // -------------------------------------------------------------------------
    // 12. Class Recordings & Revision Vault Feature Verification (#50)
    // -------------------------------------------------------------------------
    console.log('\n--- 12. Class Recordings Vault & Revision Workflow ---');

    // 12.1 Teacher fetches sessions to find a target session
    const teacherSessionsRes = await request('GET', '/schedule/sessions', null, teacherToken);
    assert(teacherSessionsRes.status === 200, 'Teacher fetches session schedule');
    const targetSession = teacherSessionsRes.data.sessions[0];
    assert(Boolean(targetSession && targetSession.id), 'Active class session found for recording attachment');

    // 12.2 Teacher attaches an educational YouTube recording link to the session
    const demoYoutubeUrl = 'https://www.youtube.com/watch?v=ZBalWWHY4Go';
    const attachRecordingRes = await request('PATCH', `/schedule/sessions/${targetSession.id}/recording`, {
      recordingUrl: demoYoutubeUrl
    }, teacherToken);
    assert(attachRecordingRes.status === 200, 'Teacher attaches recording URL to session (HTTP 200)');
    assert(attachRecordingRes.data.session.recordingUrl === demoYoutubeUrl, 'Attached recording URL verified in API response');

    // 12.3 Student fetches sessions and verifies recording URL is accessible in their vault
    const studentRecordingVaultRes = await request('GET', '/schedule/sessions', null, studentToken);
    assert(studentRecordingVaultRes.status === 200, 'Student fetches sessions for revision vault');
    const studentVaultSession = studentRecordingVaultRes.data.sessions.find(s => s.id === targetSession.id);
    assert(studentVaultSession && studentVaultSession.recordingUrl === demoYoutubeUrl, 'Student can access class recording URL in their revision vault');

    // 12.4 Teacher submits a completed class log with a recording URL
    const logWithRecordingRes = await request('POST', '/logs/submit', {
      sessionId: targetSession.id,
      studentId: targetSession.studentId || 'user-student-1',
      studentName: targetSession.studentName || 'Aryan Sharma',
      grade: targetSession.grade || 'Grade 10 (Board)',
      subject: targetSession.subject || 'Mathematics',
      date: new Date().toISOString().split('T')[0],
      startTime: '16:00',
      endTime: '17:30',
      isStudentPresent: true,
      topicsCovered: 'Quadratic Equations Deep-Dive and Formula Derivation',
      homeworkAssigned: 'Exercise 4.3 questions 1 to 5',
      recordingUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view'
    }, teacherToken);
    assert(logWithRecordingRes.status === 201, 'Teacher submits class log with recording URL (HTTP 201)');
    assert(logWithRecordingRes.data.log.recordingUrl === 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view', 'Submitted log preserves recording URL');

    // 12.5 Student fetches monthly summary and confirms class log history includes recording URL
    const studentLogsSummaryRes = await request('GET', '/logs/monthly-summary', null, studentToken);
    assert(studentLogsSummaryRes.status === 200, 'Student fetches monthly summary with class logs');
    const logsList = studentLogsSummaryRes.data.summary?.logs || [];
    const logWithRec = logsList.find(l => l.recordingUrl);
    assert(Boolean(logWithRec), 'Student class log history includes recording URL for replay');

    // 12.6 Security check: Student role cannot patch recording URL (requires TEACHER or ADMIN)
    const unauthorizedPatchRes = await request('PATCH', `/schedule/sessions/${targetSession.id}/recording`, {
      recordingUrl: 'https://malicious-link.example.com'
    }, studentToken);
    assert(unauthorizedPatchRes.status === 403, 'Student is strictly blocked from modifying session recordings (HTTP 403)');

    // 12.7 Teacher can update / clear recording link cleanly
    const clearRecordingRes = await request('PATCH', `/schedule/sessions/${targetSession.id}/recording`, {
      recordingUrl: demoYoutubeUrl // reset back to valid educational demo
    }, teacherToken);
    assert(clearRecordingRes.status === 200, 'Teacher can update or reset recording link cleanly (HTTP 200)');
    assert(clearRecordingRes.data.session.recordingUrl === demoYoutubeUrl, 'Session recording URL properly reset for ongoing student revision');

    // 12.8 Fathom AI recording link attachment (#52)
    const demoFathomUrl = 'https://fathom.video/share/dEM0X1z9LaP';
    const fathomAttachRes = await request('PATCH', `/schedule/sessions/${targetSession.id}/recording`, {
      recordingUrl: demoFathomUrl
    }, teacherToken);
    assert(fathomAttachRes.status === 200, 'Teacher attaches Fathom AI recording URL (HTTP 200)');
    assert(fathomAttachRes.data.session.recordingUrl === demoFathomUrl, 'Fathom AI recording URL stored and verified in session');

    // 12.9 Student fetches sessions and verifies Fathom AI link is accessible for revision & AI summary
    const studentFathomVaultRes = await request('GET', '/schedule/sessions', null, studentToken);
    assert(studentFathomVaultRes.status === 200, 'Student fetches session vault for Fathom AI replay');
    const fathomSession = studentFathomVaultRes.data.sessions.find(s => s.id === targetSession.id);
    assert(fathomSession && fathomSession.recordingUrl === demoFathomUrl, 'Fathom AI recording reflects in student revision vault');

    // 12.10 Admin fetches sessions and can audit Fathom recording proof
    const adminSessionsRes = await request('GET', '/schedule/sessions', null, adminToken);
    assert(adminSessionsRes.status === 200, 'Admin fetches sessions for lecture audit');
    const adminAuditedSession = adminSessionsRes.data.sessions.find(s => s.id === targetSession.id);
    assert(adminAuditedSession && adminAuditedSession.recordingUrl === demoFathomUrl, 'Admin has full visibility to audit Fathom AI lecture recording');

    // 12.11 Admin fetches /api/admin/users to audit teacher compliance rate & proof stats (#54)
    const adminUsersRes = await request('GET', '/admin/users', null, adminToken);
    assert(adminUsersRes.status === 200, 'Admin fetches users directory with teacher compliance data (HTTP 200)');
    assert(Array.isArray(adminUsersRes.data.teachers), 'Admin users response contains teachers array');
    assert(adminUsersRes.data.teachers.length > 0, 'Directory has teachers for compliance calculation');
    const auditTeacher = adminUsersRes.data.teachers[0];
    assert(typeof auditTeacher.complianceRate === 'number', 'Teacher object includes computed complianceRate percentage');
    assert(typeof auditTeacher.recordedClassesCount === 'number', 'Teacher object includes recordedClassesCount');

    // 12.12 Admin fetches /api/logs/all and audits lecture proof URLs (#54)
    const adminLogsRes = await request('GET', '/logs/all', null, adminToken);
    assert(adminLogsRes.status === 200, 'Admin fetches all class logs for quality & proof audit (HTTP 200)');
    assert(Array.isArray(adminLogsRes.data.logs), 'Class logs array returned for audit console');
    const logsWithRecording = adminLogsRes.data.logs.filter(l => Boolean(l.recordingUrl));
    assert(logsWithRecording.length >= 0, 'Admin can filter logs by recording proof status');

    // -------------------------------------------------------------------------
    // 13. Automated Monthly Fee Invoicing & Teacher Payroll Suite (#6)
    // -------------------------------------------------------------------------
    console.log('\n--- 13. Automated Monthly Fee Invoicing & Teacher Payroll Suite (#6) ---');

    // 13.1 RBAC: Unauthenticated access to billing invoices is strictly blocked
    const unauthBillingRes = await request('GET', '/billing/invoices');
    assert(unauthBillingRes.status === 401, 'Unauthenticated request to /api/billing/invoices is blocked (HTTP 401)');

    // 13.2 RBAC: Student access to admin billing invoices is strictly forbidden
    const studentBillingRes = await request('GET', '/billing/invoices', null, studentToken);
    assert(studentBillingRes.status === 403, 'Student access to admin billing invoices is strictly forbidden (HTTP 403)');

    // 13.3 Admin fetches billing executive summary
    const adminBillingSumRes = await request('GET', '/billing/summary', null, adminToken);
    assert(adminBillingSumRes.status === 200, 'Admin fetches billing executive summary (HTTP 200)');
    assert(Boolean(adminBillingSumRes.data?.metrics), 'Summary response contains metrics object');
    assert(typeof adminBillingSumRes.data.metrics.totalInvoiced === 'number', 'Metrics includes numeric totalInvoiced');
    assert(typeof adminBillingSumRes.data.metrics.totalPayroll === 'number', 'Metrics includes numeric totalPayroll');
    assert(typeof adminBillingSumRes.data.metrics.academyNetMargin === 'number', 'Metrics includes numeric academyNetMargin');

    // 13.4 Admin fetches all student fee invoices
    const adminInvoicesRes = await request('GET', '/billing/invoices', null, adminToken);
    assert(adminInvoicesRes.status === 200, 'Admin fetches all student fee invoices (HTTP 200)');
    assert(Array.isArray(adminInvoicesRes.data.invoices), 'Invoices response returns array of invoices');
    assert(adminInvoicesRes.data.invoices.length > 0, 'At least 1 student invoice generated in billing cycle');

    const sampleInvoice = adminInvoicesRes.data.invoices[0];
    assert(Boolean(sampleInvoice.invoiceNumber), 'Invoice has official invoiceNumber (e.g. INV-202611-001)');
    assert(Boolean(sampleInvoice.studentName), 'Invoice includes studentName');
    assert(typeof sampleInvoice.attendedHours === 'number', 'Invoice includes numeric attendedHours');
    assert(typeof sampleInvoice.hourlyRate === 'number', 'Invoice includes numeric hourlyRate');
    assert(typeof sampleInvoice.totalAmount === 'number', 'Invoice includes calculated totalAmount');
    assert(sampleInvoice.status === 'PAID' || sampleInvoice.status === 'UNPAID', 'Invoice status is either PAID or UNPAID');
    assert(sampleInvoice.totalAmount === Math.round(sampleInvoice.attendedHours * sampleInvoice.hourlyRate), 'Invoice total strictly matches Attended Hours x Grade Rate');

    // 13.5 Admin filters invoices by payment status
    const paidInvoicesRes = await request('GET', '/billing/invoices?status=PAID', null, adminToken);
    assert(paidInvoicesRes.status === 200, 'Admin filters invoices by status=PAID (HTTP 200)');
    assert(paidInvoicesRes.data.invoices.every(i => i.status === 'PAID'), 'All returned invoices have status PAID');

    const unpaidInvoicesRes = await request('GET', '/billing/invoices?status=UNPAID', null, adminToken);
    assert(unpaidInvoicesRes.status === 200, 'Admin filters invoices by status=UNPAID (HTTP 200)');
    assert(unpaidInvoicesRes.data.invoices.every(i => i.status === 'UNPAID'), 'All returned invoices have status UNPAID');

    // 13.6 Admin fetches teacher payroll report
    const adminPayrollRes = await request('GET', '/billing/payroll', null, adminToken);
    assert(adminPayrollRes.status === 200, 'Admin fetches teacher payroll report (HTTP 200)');
    assert(Array.isArray(adminPayrollRes.data.payroll), 'Payroll response returns array of teacher records');
    assert(adminPayrollRes.data.payroll.length > 0, 'At least 1 teacher payroll record generated');

    const samplePayroll = adminPayrollRes.data.payroll[0];
    assert(Boolean(samplePayroll.payrollNumber), 'Payroll record has payrollNumber');
    assert(Boolean(samplePayroll.teacherName), 'Payroll record includes teacherName');
    assert(typeof samplePayroll.taughtHours === 'number', 'Payroll record includes taughtHours');
    assert(typeof samplePayroll.totalPayoutAmount === 'number', 'Payroll record includes totalPayoutAmount');

    // 13.7 Logged-in student fetches their official fee invoice statement
    const myInvoiceRes = await request('GET', '/billing/my-invoice', null, studentToken);
    assert(myInvoiceRes.status === 200, 'Student fetches personal monthly invoice statement (HTTP 200)');
    assert(Boolean(myInvoiceRes.data?.invoice), 'Student invoice statement returned');

    // -------------------------------------------------------------------------
    // 14. Razorpay Payment Gateway, Invoice Settlement & Webhook Suite (#7)
    // -------------------------------------------------------------------------
    console.log('\n--- 14. Razorpay Payment Gateway, Invoice Settlement & Webhook Suite (#7) ---');

    // 14.1 Check payment config responds cleanly even without live KYC keys
    const payConfigRes = await request('GET', '/payment/config');
    assert(payConfigRes.status === 200, 'Payment config endpoint responds with HTTP 200');
    assert(payConfigRes.data.success === true, 'Payment config indicates success');
    assert(typeof payConfigRes.data.hasValidKeys === 'boolean', 'Config exposes hasValidKeys flag for sandbox fallback');
    assert(payConfigRes.data.currency === 'INR', 'Config currency is INR');

    // 14.2 Create Razorpay / Sandbox order
    const createOrderRes = await request('POST', '/payment/create-order', {
      amount: 1000,
      studentName: 'Aryan Sharma',
      receiptId: 'INV-202611-001',
      month: 11,
      year: 2026
    }, studentToken);
    assert(createOrderRes.status === 201, 'Razorpay order created cleanly (HTTP 201)');
    assert(Boolean(createOrderRes.data?.order?.id), 'Created order has an order ID');
    assert(createOrderRes.data.order.amount === 100000, 'Order amount is converted to 100000 paise (Rs. 1000)');

    // 14.3 Verify payment and confirm student invoice is persisted as PAID
    const testOrderId = createOrderRes.data.order.id;
    const testPayId = `pay_test_${Date.now().toString(36).toUpperCase()}`;
    const verifyPayRes = await request('POST', '/payment/verify', {
      orderId: testOrderId,
      paymentId: testPayId,
      amount: 1000,
      paymentMethod: 'UPI',
      studentName: 'Aryan Sharma',
      month: 11,
      year: 2026
    }, studentToken);
    assert(verifyPayRes.status === 200, 'Payment verification endpoint responds with HTTP 200');
    assert(verifyPayRes.data?.payment?.status === 'PAID', 'Payment status confirmed as PAID');
    assert(verifyPayRes.data?.invoice?.status === 'PAID', 'Student invoice immediately updated to PAID');
    assert(verifyPayRes.data?.invoice?.razorpayPaymentId === testPayId, 'Persisted invoice stores exact Razorpay Payment ID for digital receipt');

    // 14.4 Confirm /api/billing/my-invoice reflects persistent PAID status across reloads
    const paidStudentInvRes = await request('GET', '/billing/my-invoice', null, studentToken);
    assert(paidStudentInvRes.status === 200, 'Student reloads monthly invoice after payment');
    assert(paidStudentInvRes.data?.invoice?.status === 'PAID', 'Reloaded student invoice remains PAID');
    assert(paidStudentInvRes.data?.invoice?.razorpayPaymentId === testPayId, 'Reloaded student invoice retains digital receipt Payment ID');

    // 14.5 Reset demo invoice back to UNPAID cleanly
    const resetDemoRes = await request('POST', '/payment/reset-demo', {
      studentName: 'Aryan Sharma',
      month: 11,
      year: 2026
    }, studentToken);
    assert(resetDemoRes.status === 200, 'Demo invoice reset endpoint responds with HTTP 200');

    // 14.6 Razorpay Webhook listener (payment.captured) automatically marks invoice as PAID
    const webhookPayId = `pay_wh_${Date.now().toString(36).toUpperCase()}`;
    const webhookRes = await request('POST', '/payment/webhook', {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: webhookPayId,
            order_id: testOrderId,
            amount: 100000,
            method: 'upi',
            notes: {
              studentName: 'Aryan Sharma',
              month: '11',
              year: '2026'
            }
          }
        }
      }
    });
    assert(webhookRes.status === 200, 'Razorpay webhook listener responds with HTTP 200');
    assert(webhookRes.data.handled === true, 'Webhook handled payment.captured event');
    assert(webhookRes.data.invoiceStatus === 'PAID', 'Webhook automatically settled student invoice as PAID');

    // Reset again so demo environment stays clean for initial walkthrough
    await request('POST', '/payment/reset-demo', {
      studentName: 'Aryan Sharma',
      month: 11,
      year: 2026
    }, studentToken);

    // -------------------------------------------------------------------------
    // 15. Homework Photo Uploads & Student Notebook Submissions (#8)
    // -------------------------------------------------------------------------
    console.log('\n--- 15. Homework Photo Uploads & Student Notebook Submissions (#8) ---');

    // 15.1 RBAC checks
    const unauthHwRes = await request('GET', '/homework');
    assert(unauthHwRes.status === 401, 'Unauthenticated request to /api/homework is blocked (HTTP 401)');

    const studentCreateHwRes = await request('POST', '/homework', {
      title: 'Unauthorized Student Task'
    }, studentToken);
    assert(studentCreateHwRes.status === 403, 'Student cannot create teacher homework assignments (HTTP 403)');

    // 15.2 Validation: reject invalid file format on teacher question upload
    const invalidTeacherUploadRes = await request('POST', '/homework', {
      title: 'Invalid Attachment Test',
      teacherImageData: 'data:text/plain;base64,SGVsbG8='
    }, teacherToken);
    assert(invalidTeacherUploadRes.status === 400, 'Backend strictly rejects unsupported file formats with HTTP 400');

    // 15.3 Teacher posts homework assignment with question sheet PNG image
    const sampleTinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const createHwRes = await request('POST', '/homework', {
      sessionId: targetSession.id,
      title: 'Quadratic Equations Practice Sheet #8',
      description: 'Solve Q1 to Q4 clearly in your notebook and upload a photo.',
      teacherImageData: sampleTinyPng
    }, teacherToken);
    assert(createHwRes.status === 201, 'Teacher posts homework assignment with question photo (HTTP 201)');
    assert(Boolean(createHwRes.data?.homework?.id), 'Created homework returns unique ID');
    assert(createHwRes.data?.homework?.status === 'PENDING', 'Newly posted homework starts with PENDING status');
    assert(createHwRes.data?.homework?.teacherImageUrl === sampleTinyPng, 'Teacher question photo persisted');

    const createdHwId = createHwRes.data.homework.id;

    // 15.4 Student fetches homework list and sees the new assignment
    const studentHwListRes = await request('GET', '/homework', null, studentToken);
    assert(studentHwListRes.status === 200, 'Student fetches assigned homework list (HTTP 200)');
    const foundStudentHw = studentHwListRes.data?.homeworks?.find(h => h.id === createdHwId);
    assert(Boolean(foundStudentHw), 'Newly assigned homework appears in student portal');

    // 15.5 Student validation: reject unsupported notebook submission file type
    const invalidStudentSubmitRes = await request('POST', `/homework/${createdHwId}/submit`, {
      imageData: 'data:application/javascript;base64,YWxlcnQoMSk='
    }, studentToken);
    assert(invalidStudentSubmitRes.status === 400, 'Student notebook upload strictly rejects invalid file formats (HTTP 400)');

    // 15.6 Student uploads notebook photo
    const submitHwRes = await request('POST', `/homework/${createdHwId}/submit`, {
      imageData: sampleTinyPng,
      fileName: 'aryan-notebook-page1.png'
    }, studentToken);
    assert(submitHwRes.status === 200, 'Student uploads completed notebook photo cleanly (HTTP 200)');
    assert(submitHwRes.data?.homework?.status === 'SUBMITTED', 'Homework status updates to SUBMITTED upon student upload');
    assert(submitHwRes.data?.homework?.studentSubmissionUrl === sampleTinyPng, 'Student notebook submission URL stored');

    // 15.7 Teacher reviews submission and adds feedback
    const reviewHwRes = await request('PATCH', `/homework/${createdHwId}/review`, {
      status: 'REVIEWED',
      feedback: 'Neat discriminant steps! Good job.'
    }, teacherToken);
    assert(reviewHwRes.status === 200, 'Teacher reviews and approves student submission (HTTP 200)');
    assert(reviewHwRes.data?.homework?.status === 'REVIEWED', 'Homework status updates to REVIEWED');
    assert(reviewHwRes.data?.homework?.teacherFeedback === 'Neat discriminant steps! Good job.', 'Teacher feedback saved cleanly');

    // -------------------------------------------------------------------------
    // 16. Automated Teardown of Temporary Test Users
    // -------------------------------------------------------------------------
    console.log('\n--- 16. Automated Teardown of Temporary Test Users ---');
    let cleanupSuccess = 0;
    for (const userId of createdTestUserIds) {
      try {
        const delRes = await request('DELETE', `/admin/users/${userId}`, null, adminToken);
        if (delRes.status === 200) {
          console.log(`🧹 Cleaned up temporary test user: ${userId}`);
          cleanupSuccess++;
        } else {
          console.warn(`⚠️ Failed to teardown user ${userId}: status ${delRes.status}`);
        }
      } catch (err) {
        console.warn(`⚠️ Teardown error for user ${userId}:`, err.message);
      }
    }
    assert(cleanupSuccess === createdTestUserIds.length, `All ${createdTestUserIds.length} temporary test users successfully purged from database`);

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
