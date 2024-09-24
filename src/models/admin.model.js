//Importamos la base de datos y los DataTypes
import { DataTypes } from 'sequelize';
import db from '../config/db.js';

export const User = db.define('User', {
  name: {
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
  role: {
    type: DataTypes.ENUM('admin'),
    allowNull: false
  }
});
