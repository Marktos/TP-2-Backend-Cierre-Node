import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import User from './usuario.modelo.js';

const Payment = db.define('Payment', {
  recipId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 0,
    }
  },
  receiptUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true, // Verificar que sea una URL válida
    }
  },
  dateCompra: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
});

Payment.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

export default Payment;
