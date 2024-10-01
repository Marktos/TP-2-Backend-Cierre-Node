import { DataTypes } from 'sequelize';
import { db } from '../config/db.js';

const Payment = db.define('payment', {
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  
  receiptUrl: {
    type: DataTypes.STRING,  // URL del archivo PDF
    allowNull: true
  }
});


export default Payment
