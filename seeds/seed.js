const sequelize = require("../config/connection");
const { Post, Post_Title, User } = require("../models");

const postData = require("./post.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  
  const title = await Post_Title.create({ post_title_name: "General" });

  const enrichedPosts = postData.map((post) => ({
    ...post,
    userId: user.id,
    post_titleId: title.id,
  }));

  await Post.bulkCreate(enrichedPosts);

  console.log("Database seeded.");
  process.exit(0);
};

seedDatabase();
