function generateSafeTwoDigitId(existingIds) {
  const ids = existingIds.map(id =>
    (typeof id === "string" && id.startsWith("TS")) ? id : parseInt(id)
  );

  for (let i = 10; i <= 99; i++) {
    if (!ids.includes(i)) return i;
  }

  return `TS${Date.now()}`; // fallback ID
}

module.exports = generateSafeTwoDigitId;
