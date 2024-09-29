import { DataTypes } from 'sequelize';
import { db } from '../config/db.js';
import User from '../models/usuario.modelo.js';

const Payment = db.define('Payment', {
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  
  receiptUrl: {
    type: DataTypes.STRING,  // URL del recibo PDF
    allowNull: true
  }
});

//Hago la relacion para que un recibo pertenezca a un solo usuario
Payment.belongsTo(User, {
  foreignKey: 'userId', 
  as: 'user'
});

export default Payment
