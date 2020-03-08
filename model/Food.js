/** FOOD Model */

const sequelize = require('../config/sequelize');
const Sequelize = require('sequelize');


const Model = Sequelize.Model;
class Food extends Model { }
Food.init({
  name: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  image: {
    type: Sequelize.STRING(300),
    allowNull: false
  },
  market: {
    type: Sequelize.STRING(300),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'foods'
});

module.exports = Food;