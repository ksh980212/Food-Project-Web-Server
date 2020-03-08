/** FOODDETAIL model */

const sequelize = require('../config/sequelize');
const Sequelize = require('sequelize');


const Model = Sequelize.Model;
class Food_Detail extends Model { }
Food_Detail.init({
  food_id: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  food_key: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  food_value: {
    type: Sequelize.STRING(2500),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'food_details'
});

module.exports = Food_Detail;