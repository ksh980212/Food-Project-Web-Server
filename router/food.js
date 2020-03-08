//* module import*/
const express = require("express");
const axios = require('axios');

//* exception handler import */
const basicValidateRequestBody = require("../exception/basicValidateRequestException");
const { occurError, occurSuccess } = require('../exception/occurMessage');

/** Sequelize Model import */
const Food = require('../model/Food');
const FoodEvaluation = require('../model/FoodEvaluation');

/**Sequelize config ipmort */
const sequelize = require("../config/sequelize");
const Op = require('sequelize').Op

/** express routing */
const router = express.Router();



/**
 *  POST /api/v1/food/instagram_recommend (인스타그램 추천 시스템)
 */

router.post("/instagram_recommend", (req, res) => {

  /** Receive request.body  */
  const instagramID = req.body.instagramID;


  /**AI Model request */
  axios.post(`http://localhost:5000/instagram`, {
    instagramID: instagramID
  }).then((response) => {

    /**AI Model response */
    const data = response.data;

    Food.findAll({
      attributes: ['id', 'name', 'image', 'market'],
      where: { id: data }
    }).then((v) => {

      /** Get Food detail information from database */
      let item = [];
      for (let i = 0; i < v.length; i++) {
        item.push(v[i].dataValues);
      }

      /** Instagram Recommendation SUCCESS */
      res.status(200).send(item);

    }).catch(() => {
      return occurError(res, 500, "DB Error");
    })
  }).catch(() => {
    return occurError(res, 400, "AI Server Error");
  })

});



/**
 *  POST /api/v1/food/food_recommend_home (일반추천 시스템)
 */

router.post("/food_recommend_home", (req, res) => {


  /** Receive request.body  
    *  
    * include: Preferred food
    * exclude: exclude food
    */
  const include = req.body.include
  const exclude = req.body.exclude;

  Food.findAll({
    where: { name: include }
  }).then((v) => {

    let include_item_index = [];

    //** Get Food index from database */
    for (let i = 0; i < v.length; i++) {
      include_item_index.push(v[i].dataValues.id);
    }

    //** AI Model request */
    axios.post("http://localhost:5000/normal", {
      include: include_item_index,
      exclude: exclude
    }).then((response) => {

      /** AI Model response food index data */
      const index = response.data;

      /** Get Food detail information from database */
      Food.findAll({
        attributes: ['id', 'name', 'image', 'market'],
        where: { id: index }
      }).then((response) => {

        /** Normal Recommendation SUCCESS */
        res.status(200).send(response);

      }).catch(() => {
        return occurError(res, 500, "DB Error");
      })

    }).catch(() => {
      return occurError(res, 400, "AI Server Error");
    })

  }).catch(() => {
    return occurError(res, 500, "DB Error");
  })
});



/**
 *  GET /api/v1/food/food_search
 */

router.get("/food_search", (req, res) => {

  /** Search request body Exception Hanlder */
  if (basicValidateRequestBody(req.query) === false) {
    return occurError(res, 400, "No search keyword input");
  }

  /** Receive request.query  */
  const query = req.query.search;

  /** Pagination hanlder  */
  let query_page = req.query.page ? req.query.page * 6 : 0;

  Food.findAll({
    attributes: ['id', 'name', 'image', 'market'],
    where: { 'name': { [Op.substring]: query } },
    limit: 6,
    offset: query_page
  }).then(response => {

    /** Search Food SUCCESS */
    res.status(200).send(response);

  }).catch(() => {
    return occurError(res, 500, "DB Error");
  })

});



/**
 *  GET /api/v1/food/food_count (페이지네이션 구현용)
 */


router.get('/food_count', (req, res) => {

  /** Food count request body Exception Hanlder */
  if (basicValidateRequestBody(req.query) === false) {
    return occurError(res, 400, "food_count input error");
  }

  /** Receive request.query  */
  const query = req.query.search;

  Food.findAll({
    attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'size']],
    where: {
      'name': { [Op.substring]: query }
    }
  }).then(response => {

    /**Food Count SUCCESS */
    res.status(200).send(response);

  }).catch(() => {
    return occurError(res, 500, "DB Error");
  })
})



/**
 *  GET /api/v1/food/food_detail
 */

router.get("/food_detail", (req, res) => {

  /** Food Detail request body Exception Hanlder */
  if (basicValidateRequestBody(req.query) === false) {
    return occurError(res, 400, "food_detail input error");
  }

  /** Receive request.query  */
  const food_id = Number(req.query.id);

  sequelize.query(`SELECT * FROM foods JOIN food_details ON foods.id = food_details.food_id WHERE foods.id="${food_id}"`)
    .then(response => {

      /** Food Detail information SUCCESS */
      res.status(200).send(response[0]);

    }).catch(() => {
      return occurError(res, 500, "DB Error");
    });

});



/**
 *  POST /api/v1/food/food_evaluation
 */

router.post("/food_evaluation", (req, res) => {


  /** Receive request.body  */
  const user_id = req.body.user_id;
  const food_evaluation_score = Number(req.body.food_evaluation_score);
  const food_id = Number(req.body.food_id);

  /** Food_evaluation_score Exception Hanlder */
  if (food_evaluation_score < 1 || food_evaluation_score > 5) {
    return occurError(res, 400, "food_evaluation score range Error");
  }

  FoodEvaluation.create({
    evaluation_score: food_evaluation_score,
    food_id: food_id,
    user_id: user_id
  }).then(() => {

    //** Food Evaluation SUCESS */
    occurSuccess(res, 200, "OK", "review Ok");

  }).catch(() => {
    return occurError(res, 500, "DB Error");
  })

});



/**
 *  GET /api/v1/food/food_review (전체 사용자 평가 지표)
 */

router.get("/food_review", (req, res) => {

  sequelize.query(`SELECT AVG(evaluation_score) AS average, COUNT(id) AS count FROM food_evaluations`)
    .then(response => {

      /** Food Evaluation SUCCESS */
      res.status(200).send(response[0]);

    }).catch(() => {
      return occurError(res, 500, "DB Error");
    });
});



/**
 *  GET /api/v1/food/food_review/detail (해당 음식 레시피의 사용자 평가 지표)
 */

router.get("/food_review/detail", (req, res) => {

  /** Food Review request query Exception Hanlder */
  if (basicValidateRequestBody(req.query) === false) {
    return occurError(res, 400, "food_review input error");
  }

  /** Receive request.query  */
  const food_id = req.query.food_id;

  sequelize.query(`SELECT AVG(evaluation_score) AS average, COUNT(id) AS count FROM food_evaluations WHERE food_id= "${food_id}"`)
    .then(response => {

      /** Food review SUCCESS */
      res.status(200).send(response);

    }).catch(() => {
      return occurError(res, 500, "DB Error");
    });
});

module.exports = router;
