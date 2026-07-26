const getHealth = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AI Career Tracker API is running',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealth };