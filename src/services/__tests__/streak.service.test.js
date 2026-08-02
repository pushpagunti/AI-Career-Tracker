const mongoose = require('mongoose');

// Mock the CodingProblem model so we control exactly what "database" data the service sees
jest.mock('../../models/CodingProblem.model', () => ({
  find: jest.fn(),
}));

const CodingProblem = require('../../models/CodingProblem.model');
const { calculateStreaks } = require('../streak.service');

// Helper to build a fake Mongoose query chain: find(...).sort(...)
const mockFind = (problems) => {
  CodingProblem.find.mockReturnValue({
    sort: jest.fn().mockResolvedValue(problems),
  });
};

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

describe('calculateStreaks', () => {
  const userId = new mongoose.Types.ObjectId();

  afterEach(() => jest.clearAllMocks());

  it('returns zero streaks when no problems exist', async () => {
    mockFind([]);
    const result = await calculateStreaks(userId);
    expect(result).toEqual({ currentStreak: 0, longestStreak: 0 });
  });

  it('counts a single day solved today as a streak of 1', async () => {
    mockFind([{ solvedAt: daysAgo(0) }]);
    const result = await calculateStreaks(userId);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it('keeps the streak alive if the most recent solve was yesterday (grace period)', async () => {
    mockFind([{ solvedAt: daysAgo(1) }, { solvedAt: daysAgo(2) }]);
    const result = await calculateStreaks(userId);
    expect(result.currentStreak).toBe(2);
  });

  it('breaks the streak if both today and yesterday are empty', async () => {
    mockFind([{ solvedAt: daysAgo(3) }, { solvedAt: daysAgo(4) }]);
    const result = await calculateStreaks(userId);
    expect(result.currentStreak).toBe(0);
  });

  it('collapses multiple problems on the same day into one streak day', async () => {
    mockFind([{ solvedAt: daysAgo(0) }, { solvedAt: daysAgo(0) }, { solvedAt: daysAgo(0) }]);
    const result = await calculateStreaks(userId);
    expect(result.currentStreak).toBe(1);
  });

  it('finds the correct longest streak even if it is not the current one', async () => {
    mockFind([
      { solvedAt: daysAgo(0) }, // current streak: just today = 1
      { solvedAt: daysAgo(10) },
      { solvedAt: daysAgo(11) },
      { solvedAt: daysAgo(12) },
      { solvedAt: daysAgo(13) }, // a historical 4-day streak, longer than current
    ]);
    const result = await calculateStreaks(userId);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(4);
  });
});