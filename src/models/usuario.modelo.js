//Importamos la base de datos y los DataTypes
import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const User = db.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false
    
  }
});


export default User