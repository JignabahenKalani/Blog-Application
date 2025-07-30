const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sequelize = require("./config/connection");
const routes = require("./routes");
const { Post, User, Post_Title } = require("./models"); // import models for homepage

const app = express();
const PORT = process.env.PORT || 3001;

const rebuild = process.argv[2] === "--rebuild";

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));


app.get("/", async (req, res) => {
  try {
    const postsData = await Post.findAll({
      order: [["createdOn", "DESC"]],
    });
    res.json(postsData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

app.use(routes);

sequelize.sync({ force: rebuild }).then(() => {
  app.listen(PORT, () =>
    console.log(`Now listening at http://localhost:${PORT}`)
  );
});
