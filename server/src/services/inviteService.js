/**
 * Academy Invitation Code Service
 * Manages authorized onboarding tokens for Teachers and Administrative Staff
 */

// Default pre-seeded system authorization keys (always valid for fallback/demo)
const STATIC_TEACHER_CODES = ['TUTOR-2026-INVITE', 'ACADEMY-TUTOR-2026', 'TUTOR-DEMO'];
const STATIC_ADMIN_CODES = ['ADMIN-SUPER-2026', 'DIRECTOR-2026', 'ADMIN-DEMO'];

// In-memory store for dynamically generated invite tokens
let dynamicInvites = [
  {
    id: 'inv-seed-1',
    code: 'TUTOR-2026-INVITE',
    role: 'TEACHER',
    subject: 'Mathematics',
    createdBy: 'Academy Director',
    status: 'ACTIVE',
    createdAt: new Date('2026-11-01T09:00:00Z').toISOString(),
    usedBy: null,
    usedAt: null
  },
  {
    id: 'inv-seed-2',
    code: 'ADMIN-SUPER-2026',
    role: 'ADMIN',
    subject: 'Operations & Management',
    createdBy: 'Academy Director',
    status: 'ACTIVE',
    createdAt: new Date('2026-11-01T09:00:00Z').toISOString(),
    usedBy: null,
    usedAt: null
  }
];

/**
 * List all current invite codes
 */
const listInvites = () => {
  return dynamicInvites;
};

/**
 * Generate a new invite code
 * @param {Object} options - { role, subject, customCode, createdBy }
 */
const createInvite = ({ role = 'TEACHER', subject = 'General Studies', customCode = '', createdBy = 'Admin' }) => {
  const normalizedRole = role.toUpperCase();
  let code = '';

  if (customCode && customCode.trim()) {
    code = customCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  } else {
    const rolePrefix = normalizedRole === 'TEACHER' ? 'TUTOR' : 'ADMIN';
    const subPrefix = subject
      ? subject.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase()
      : 'FAC';
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    code = `${rolePrefix}-${subPrefix}-${randomDigits}`;
  }

  // Ensure uniqueness
  const exists = dynamicInvites.some((inv) => inv.code === code && inv.status === 'ACTIVE');
  if (exists) {
    // Append extra randomness if duplicate
    code = `${code}-${Math.floor(10 + Math.random() * 90)}`;
  }

  const newInvite = {
    id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    code,
    role: normalizedRole,
    subject: subject || (normalizedRole === 'TEACHER' ? 'General Studies' : 'Operations'),
    createdBy: createdBy || 'Admin',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    usedBy: null,
    usedAt: null
  };

  dynamicInvites.unshift(newInvite);
  return newInvite;
};

/**
 * Validate and redeem an invite code during registration
 * @param {string} code
 * @param {string} role - 'TEACHER' | 'ADMIN'
 * @param {string} userIdentifier
 * @param {string} userName
 */
const validateAndRedeemInvite = (code, role, userIdentifier, userName) => {
  if (!code) {
    return { valid: false, error: 'Invitation code is required for this role.' };
  }

  const cleanCode = code.trim().toUpperCase();
  const cleanRole = (role || '').toUpperCase();

  // 1. Check static fallback keys
  if (cleanRole === 'TEACHER' && STATIC_TEACHER_CODES.includes(cleanCode)) {
    return { valid: true, subject: null, isStatic: true };
  }

  if (cleanRole === 'ADMIN' && STATIC_ADMIN_CODES.includes(cleanCode)) {
    return { valid: true, subject: null, isStatic: true };
  }

  // 2. Check dynamic codes
  const foundInvite = dynamicInvites.find((inv) => inv.code === cleanCode);

  if (!foundInvite) {
    return { valid: false, error: `Invalid ${cleanRole === 'TEACHER' ? 'Tutor' : 'Staff'} invitation code. Please check with your Academy Administrator.` };
  }

  if (foundInvite.role !== cleanRole) {
    return { valid: false, error: `This invitation code is for role ${foundInvite.role}, but registration is for ${cleanRole}.` };
  }

  if (foundInvite.status === 'REVOKED') {
    return { valid: false, error: 'This invitation code has been revoked by the Academy Administrator.' };
  }

  if (foundInvite.status === 'USED') {
    return { valid: false, error: `This invitation code has already been redeemed by ${foundInvite.usedBy || 'another user'}.` };
  }

  // Redeem the dynamic invite
  foundInvite.status = 'USED';
  foundInvite.usedBy = userName || userIdentifier || 'Registered User';
  foundInvite.usedAt = new Date().toISOString();

  return {
    valid: true,
    subject: foundInvite.subject,
    invite: foundInvite,
    isStatic: false
  };
};

/**
 * Revoke or delete an invite code
 */
const revokeInvite = (code) => {
  const cleanCode = (code || '').trim().toUpperCase();
  const invite = dynamicInvites.find((inv) => inv.code === cleanCode);
  if (!invite) return false;

  invite.status = 'REVOKED';
  return true;
};

module.exports = {
  STATIC_TEACHER_CODES,
  STATIC_ADMIN_CODES,
  listInvites,
  createInvite,
  validateAndRedeemInvite,
  revokeInvite
};
