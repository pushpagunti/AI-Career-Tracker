const LearningItem = require('../models/LearningItem.model');
const Roadmap = require('../models/Roadmap.model');
const { createNotification } = require('../services/notification.service');


// @route GET /api/learning
// @access Private
const getLearningItems = async (req, res) => {
  try {

    const filter = {
      user: req.user.id
    };


    if (req.query.status) {
      filter.status = req.query.status;
    }


    const items = await LearningItem.find(filter)
      .populate('relatedSkill', 'name category')
      .sort({ updatedAt: -1 });


    res.status(200).json({

      status: 'success',

      results: items.length,

      data: {
        items
      }

    });


  } catch (error) {

    console.error("Get Learning Items Error:", error);

    res.status(500).json({

      status: 'error',

      message: error.message

    });

  }
};




// @route POST /api/learning
// @access Private
const addLearningItem = async (req, res) => {

  try {


    const progress = req.body.progressPercent || 0;


    let status = 'not-started';

    let startedAt = null;

    let completedAt = null;



    if (progress > 0 && progress < 100) {

      status = 'in-progress';

      startedAt = new Date();

    }



    if (progress === 100) {

      status = 'completed';

      startedAt = new Date();

      completedAt = new Date();

    }



    const item = await LearningItem.create({

      ...req.body,

      user: req.user.id,

      status,

      startedAt,

      completedAt

    });



    res.status(201).json({

      status: 'success',

      data: {
        item
      }

    });



  } catch(error) {


    console.error("Add Learning Item Error:", error);


    res.status(500).json({

      status:'error',

      message:error.message

    });

  }

};






// @route PUT /api/learning/:id
// @access Private
const updateLearningItem = async (req, res) => {

  try {


    const item = await LearningItem.findOne({

      _id: req.params.id,

      user: req.user.id

    });



    if (!item) {

      return res.status(404).json({

        status:'fail',

        message:'Learning item not found'

      });

    }



    const wasAlreadyCompleted = item.status === 'completed';



    Object.assign(item, req.body);



    item.user = req.user.id;



    const progress = item.progressPercent || 0;



    if(progress === 0){

      item.status = 'not-started';

      item.startedAt = null;

      item.completedAt = null;


    } else if(progress === 100){


      item.status = 'completed';


      if(!item.startedAt){

        item.startedAt = new Date();

      }


      if(!item.completedAt){

        item.completedAt = new Date();

      }


    } else {


      item.status = 'in-progress';


      if(!item.startedAt){

        item.startedAt = new Date();

      }


      item.completedAt = null;


    }




    await item.save();




    // Roadmap completion notification
    if(!wasAlreadyCompleted && item.status === 'completed'){


      const linkedRoadmap = await Roadmap.findOne({

        user:req.user.id,

        'progressLinks.learningItem': item._id

      });



      if(linkedRoadmap){


        const linkedTopic = linkedRoadmap.progressLinks.find(

          (p)=> 
            p.learningItem &&
            p.learningItem.toString() === item._id.toString()

        );



        if(linkedTopic){


          await createNotification(

            req.user.id,

            'roadmap',

            `✅ You completed "${linkedTopic.topic}" on your ${linkedRoadmap.targetRole} roadmap!`,

            `/roadmap/${linkedRoadmap._id}`

          );


        }

      }


    }



    res.status(200).json({

      status:'success',

      data:{
        item
      }

    });



  } catch(error){


    console.error("Update Learning Item Error:", error);


    res.status(500).json({

      status:'error',

      message:error.message

    });


  }

};






// @route DELETE /api/learning/:id
// @access Private
const deleteLearningItem = async (req,res)=>{

  try{


    const item = await LearningItem.findOneAndDelete({

      _id:req.params.id,

      user:req.user.id

    });



    if(!item){

      return res.status(404).json({

        status:'fail',

        message:'Learning item not found'

      });

    }



    res.status(200).json({

      status:'success',

      message:'Learning item deleted'

    });



  }catch(error){


    console.error("Delete Learning Item Error:", error);


    res.status(500).json({

      status:'error',

      message:error.message

    });


  }

};





module.exports = {

  getLearningItems,

  addLearningItem,

  updateLearningItem,

  deleteLearningItem

};