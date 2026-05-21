const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '..', '..', 'debug-108895.log');

const debugLog = (entry) => {
  try {
    fs.appendFileSync(
      LOG_PATH,
      `${JSON.stringify({
        sessionId: '108895',
        timestamp: Date.now(),
        ...entry
      })}\n`
    );
  } catch {
    // ignore logging failures
  }
};

module.exports = debugLog;
