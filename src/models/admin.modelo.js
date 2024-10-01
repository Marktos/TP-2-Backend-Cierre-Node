//Importamos la base de datos y los DataTypes
import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Admin = db.define('admins', {
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
    type: DataTypes.STRING,
    defaultValue: "admin"
  }
}, {
  tableName: 'admins'
});

export default Admin
