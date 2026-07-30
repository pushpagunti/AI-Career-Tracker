const CareerRecommendation = require('../models/CareerRecommendation.model');
const Skill = require('../models/Skill.model');
const Profile = require('../models/Profile.model');
const { getCareerRecommendation } = require('../services/ai/aiService');
const { createNotification } = require('../services/notification.service');


// @route POST /api/career/recommend
const generateRecommendation = async (req, res) => {
  try {

    const [skills, profile] = await Promise.all([
      Skill.find({ user: req.user.id }),
      Profile.findOne({ user: req.user.id }),
    ]);


    const inputSnapshot = {
      skills: skills.map((s) => s.name),
      experienceLevel: profile?.experienceLevel || 'student',
      careerGoal: profile?.careerGoal || '',
    };


    const { parsed, rawResponse } = await getCareerRecommendation(inputSnapshot);



    const saved = await CareerRecommendation.create({

      user: req.user.id,

      inputSnapshot,

      recommendations: parsed.recommendations,

      rawModelResponse: rawResponse,

    });



    // Create notification after career recommendation is generated
    await createNotification(

      req.user.id,

      'career',

      `Your career recommendations are ready — ${saved.recommendations.length} paths suggested.`,

      `/career/${saved._id}`

    );



    res.status(201).json({

      status: 'success',

      data: {

        id: saved._id,

        inputSnapshot: saved.inputSnapshot,

        recommendations: saved.recommendations,

        createdAt: saved.createdAt,

      },

    });



  } catch (error) {


    console.error("Career Recommendation Error:", error);


    res.status(500).json({

      status: "error",

      message: error.message

    });

  }

};




// @route GET /api/career/history
const getRecommendationHistory = async (req, res) => {

  try {


    const history = await CareerRecommendation.find({

      user: req.user.id

    })

      .select('inputSnapshot recommendations createdAt')

      .sort({ createdAt: -1 });



    res.status(200).json({

      status: 'success',

      results: history.length,

      data: {

        history

      }

    });



  } catch (error) {


    console.error("Career History Error:", error);


    res.status(500).json({

      status: 'error',

      message: 'Server error fetching history'

    });

  }

};





// @route GET /api/career/:id
const getRecommendationById = async (req, res) => {

  try {


    const result = await CareerRecommendation.findOne({

      _id: req.params.id,

      user: req.user.id

    });



    if (!result) {

      return res.status(404).json({

        status: 'fail',

        message: 'Recommendation not found'

      });

    }



    res.status(200).json({

      status: 'success',

      data: {

        result

      }

    });



  } catch (error) {


    console.error("Career Recommendation Fetch Error:", error);


    res.status(500).json({

      status: 'error',

      message: 'Server error fetching recommendation'

    });

  }

};




module.exports = {

  generateRecommendation,

  getRecommendationHistory,

  getRecommendationById

};