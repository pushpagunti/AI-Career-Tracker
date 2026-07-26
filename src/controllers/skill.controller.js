const Skill = require('../models/Skill.model');


// @route GET /api/skills?category=frontend
const getSkills = async (req, res) => {
  try {
    const filter = { user: req.user.id };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const skills = await Skill.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: skills.length,
      data: { skills }
    });

  } catch (error) {
    console.error("Get Skills Error:", error);

    res.status(500).json({
      status: 'error',
      message: 'Server error fetching skills'
    });
  }
};


// @route POST /api/skills
const addSkill = async (req, res) => {
  try {

    const skill = await Skill.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: { skill }
    });

  } catch (error) {

    console.error("Add Skill Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: 'You already have this skill added'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Server error adding skill'
    });
  }
};


// @route PUT /api/skills/:id
const updateSkill = async (req, res) => {
  try {

    const skill = await Skill.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      {
        $set: req.body
      },
      {
        new: true,
        runValidators: true
      }
    );


    if (!skill) {
      return res.status(404).json({
        status: 'fail',
        message: 'Skill not found or you do not have permission to edit it'
      });
    }


    res.status(200).json({
      status: 'success',
      data: { skill }
    });


  } catch (error) {

    console.error("Update Skill Error:", error);

    res.status(500).json({
      status: 'error',
      message: 'Server error updating skill'
    });
  }
};



// @route DELETE /api/skills/:id
const deleteSkill = async (req, res) => {
  try {

    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });


    if (!skill) {
      return res.status(404).json({
        status: 'fail',
        message: 'Skill not found or you do not have permission to delete it'
      });
    }


    res.status(200).json({
      status: 'success',
      message: 'Skill deleted'
    });


  } catch (error) {

    console.error("Delete Skill Error:", error);

    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};



// @route GET /api/skills/summary
const getSkillSummary = async (req, res) => {
  try {

    const summary = await Skill.aggregate([

      // Only logged-in user's skills
      {
        $match: {
          user: req.user._id
        }
      },


      // Group skills by category
      {
        $group: {
          _id: '$category',
          count: {
            $sum: 1
          },
          skills: {
            $push: {
              name: '$name',
              proficiency: '$proficiency'
            }
          }
        }
      },


      // Sort highest count first
      {
        $sort: {
          count: -1
        }
      }

    ]);


    res.status(200).json({
      status: 'success',
      data: { summary }
    });


  } catch (error) {

    console.error("Summary Error:", error);

    res.status(500).json({
      status: 'error',
      message: 'Server error generating summary'
    });
  }
};



module.exports = {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getSkillSummary
};