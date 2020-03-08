/**FOODEVALUATION Model */

const sequelize = require('../config/sequelize');
const Sequelize = require('sequelize');

const Model = Sequelize.Model;
class FoodEvaluation extends Model { }
FoodEvaluation.init({
  user_id: {
    type: Sequelize.STRING(30),
    allowNull: true
  },
  evaluation_score: {
    type: Sequelize.TINYINT(1),
    allowNull: false
  },
  food_id: {
    type: Sequelize.BIGINT(20),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'food_evaluations'
});

module.exports = FoodEvaluation;