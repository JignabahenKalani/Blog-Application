const { Model,DataTypes }= require("sequelize");

const sequelize = require ("../config/connection");

class Title extends Model {}

Title.init(
    {
        title_post:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        modelName: "title",
    }
);
module.exports = Title;
