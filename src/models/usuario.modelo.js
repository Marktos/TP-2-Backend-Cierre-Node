//Importamos la base de datos y los DataTypes
import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import bcrypt from 'bcryptjs'

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
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
  role: {
    type: DataTypes.ENUM('superusuario', 'admin', 'user'),
    defaultValue: 'user',
    allowNull: false
  }
});

//Vamos a encriptar la password antes de que el usuario se cree
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});


export default User