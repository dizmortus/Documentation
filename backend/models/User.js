const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
module.exports=(sequelize, Sequelize) => {  
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role:{
      type:DataTypes.STRING,
      allowNull:false
  }
});

User.beforeCreate(async (user, options) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.prototype.comparePassword = async function(candidatePassword) {
  
  return bcrypt.compare(candidatePassword, this.password);
};
return User;
}

