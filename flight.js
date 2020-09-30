const Sequelize =require("sequelize")
const sequelize = require("../dbs/connection")

module.exports =sequelize.define("flight",{

    id:{
        type:Sequelize.DataTypes.INTEGER(10),
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    location:{
        type:Sequelize.DataTypes.STRING,
        allowNull:false
    },
    from:{
        type:Sequelize.DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false
    },
}
)