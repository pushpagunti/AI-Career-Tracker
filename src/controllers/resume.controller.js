const Resume = require('../models/Resume.model');
const { buildResumeSeedData } = require('../services/resume.service');
const { generateResumePDF } = require('../services/pdf.service');

// @route GET /api/resumes
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .select('title template createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      status: 'success',
      results: resumes.length,
      data: { resumes },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Server error fetching resumes',
    });
  }
};

// @route GET /api/resumes/:id
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        status: 'fail',
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { resume },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Server error fetching resume',
    });
  }
};

// @route POST /api/resumes
const createResume = async (req, res) => {
  try {
    const seedData = await buildResumeSeedData(req.user.id);

    const resume = await Resume.create({
      user: req.user.id,
      title: req.body.title || 'My Resume',
      ...seedData,
    });

    res.status(201).json({
      status: 'success',
      data: { resume },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Server error creating resume',
    });
  }
};

// @route PUT /api/resumes/:id
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resume) {
      return res.status(404).json({
        status: 'fail',
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { resume },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Server error updating resume',
    });
  }
};

// @route DELETE /api/resumes/:id
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        status: 'fail',
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Resume deleted',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Server error deleting resume',
    });
  }
};

// @route GET /api/resumes/:id/pdf
const downloadResumePDF = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        status: 'fail',
        message: 'Resume not found',
      });
    }

    const pdfBuffer = await generateResumePDF(resume);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${resume.title.replace(/\s+/g, '_')}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Server error generating PDF',
    });
  }
};

module.exports = {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  downloadResumePDF,
};