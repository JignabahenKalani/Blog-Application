// import all models
const Post = require("./post");
const Title = require("./title");
const User = require("./user");

Post.belongsTo(Title, {
  foreignKey: "titleId",
  as: "title",
});

Title.hasMany(Post, {
  foreignKey: "titleId",
  as: "posts",
});

User.hasMany(Post, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = {
  Post,
  Title,
  User,
};
