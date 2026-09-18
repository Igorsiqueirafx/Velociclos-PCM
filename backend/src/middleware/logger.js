function logError(context, error) {
  console.error(`[${context}]`, error instanceof Error ? error.message : String(error));
}

function logWarn(context, message) {
  console.warn(`[${context}]`, message);
}

function logInfo(context, message) {
  console.info(`[${context}]`, message);
}

module.exports = { logError, logWarn, logInfo };
