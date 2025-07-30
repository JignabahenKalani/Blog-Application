const { Model,DataTypes }= require("sequelize");

const sequelize = require ("../config/connection");

class Post_Title extends Model {}

Post_Title.init(
    {
        post_title_name:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: "title",
    }
);
module.exports = Post_Title;
