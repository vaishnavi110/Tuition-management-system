const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

/**
 * Retries transient database connection failures (e.g. Render cold starts / idle drops) once
 */
prisma.withDbRetry = async (operation, retries = 1) => {
  try {
    return await operation();
  } catch (err) {
    const msg = String(err?.message || '').toLowerCase();
    const isTransient = err?.code === 'P1001' || err?.code === 'P1017' ||
      msg.includes("can't reach database") || msg.includes('connection') || msg.includes('timed out');
    if (retries > 0 && isTransient) {
      try { await prisma.$connect(); } catch (_) {}
      return await operation();
    }
    throw err;
  }
};

module.exports = prisma;

