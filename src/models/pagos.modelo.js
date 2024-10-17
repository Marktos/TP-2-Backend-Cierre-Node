import { DataTypes } from 'sequelize';
import { db } from '../config/db.js';
import User from './usuario.modelo.js';

const Payment = db.define('Payment', {
  recipId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  receiptUrl: {
    type: DataTypes.STRING,  // URL del archivo PDF
    allowNull: true
  },
  dateCompra: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
});

Payment.belongsTo(User, { foreignKey: 'userId' })


export default Payment
