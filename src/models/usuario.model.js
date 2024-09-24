//Importamos la base de datos y los DataTypes
import { DataTypes,  } from 'sequelize';
import db from '../config/db.js';
import Payment from './pagos.model.js';

export const User = db.define('User', {
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
});
//Hago que un usuario pueda tener varios pagos
User.hasMany(Payment, {
  foreignKey: "userId",
  as: 'payments'
})