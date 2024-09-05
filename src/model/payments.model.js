const {sequelize, Model, DataTypes} = require('../DB/database');

class Payment extends Model {}

Payment.init({
      payment_id:{
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      course_id:{
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