import { DataTypes } from 'sequelize';
import { db } from '../config/db.js';

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
  foreignKey: 'userId', // Define el campo clave foránea en el modelo Payment
  as: 'user' // Alias opcional para la relación
});

export default Payment
