const Post = require("./post");
const Post_Title = require("./post_title");
const User = require("./user");

// Associations
Post.belongsTo(Post_Title, {
  foreignKey: "post_titleId",
  as: "post_title",
});

Post_Title.hasMany(Post, {
  foreignKey: "post_titleId",
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
  Post_Title,
  User,
};
