/** USER Model */

const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const Model = Sequelize.Model;
class User extends Model { }
User.init({
  user_id: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  password: {
    type: Sequelize.STRING(300),
    allowNull: false
  },
  email: {
    type: Sequelize.STRING(40),
    allowNull: false
  },
  name: {
    type: Sequelize.STRING(10),
    allowNull: false
  },
  salt: {
    type: Sequelize.STRING(30),
    allowNull: false
  },
  instargramID: {
    type: Sequelize.STRING(30),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'user'
});


module.exports = User;