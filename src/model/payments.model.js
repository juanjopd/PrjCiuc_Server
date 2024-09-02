const {sequelize, Model, DataTypes} = require('../db/sequelize');

class Payment extends Model {}

Payment.init({
      payment_id:{
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      couserID:{
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      comprobantFile:{
          type: DataTypes.STRING,
          allowNull: false,
      },
      paymentDate:{
          type: DataTypes.DATE,
          allowNull: false,
      },

    },
    {
      sequelize,
      modelName: 'Payment',
    }
  );


module.exports = Payment;