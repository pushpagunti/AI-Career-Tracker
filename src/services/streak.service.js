const CodingProblem = require('../models/CodingProblem.model');

// Helper: format a Date into a 'YYYY-MM-DD' string in local time, so we compare by calendar day
const toDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const calculateStreaks = async (userId) => {
  // Fetch only the field we need, sorted newest first
  const problems = await CodingProblem.find({ user: userId }, 'solvedAt').sort({ solvedAt: -1 });

  if (problems.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Step 1: get distinct calendar days that have at least one problem solved
  const uniqueDateKeys = [...new Set(problems.map((p) => toDateKey(p.solvedAt)))];
  // uniqueDateKeys is already sorted descending because `problems` was sorted descending

  // Step 2: calculate current streak, walking backwards from today (with grace for today)
  const todayKey = toDateKey(new Date());
  const yesterdayKey = toDateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));

  let currentStreak = 0;

  // Grace rule: if neither today nor yesterday has an entry, the streak is already broken
  const mostRecentKey = uniqueDateKeys[0];
  if (mostRecentKey === todayKey || mostRecentKey === yesterdayKey) {
    // Walk backwards day-by-day from the most recent solved date, counting consecutive days
    let cursor = new Date(mostRecentKey);
    for (const key of uniqueDateKeys) {
      if (toDateKey(cursor) === key) {
        currentStreak += 1;
        cursor.setDate(cursor.getDate() - 1); // move one day earlier, expect to find it next
      } else {
        break; // gap found, streak stops here
      }
    }
  }

  // Step 3: calculate longest streak ever, by scanning all unique dates in ascending order
  const ascendingKeys = [...uniqueDateKeys].reverse();
  let longestStreak = 1;
  let running = 1;

  for (let i = 1; i < ascendingKeys.length; i++) {
    const prev = new Date(ascendingKeys[i - 1]);
    const curr = new Date(ascendingKeys[i]);
    const diffDays = Math.round((curr - prev) / (24 * 60 * 60 * 1000));

    if (diffDays === 1) {
      running += 1;
    } else {
      running = 1; // gap — reset
    }
    longestStreak = Math.max(longestStreak, running);
  }

  return { currentStreak, longestStreak };
};

module.exports = { calculateStreaks };