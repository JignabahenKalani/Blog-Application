// new router
const app = require("express").Router();

// import models

const { Title } = require("../models/index");

// new post 

app.post("/", async(req,res)=>{
    try{
        const { title_post } = req.body;
        const title = await Title.create({ title_post });
        res.status(201).json(title);
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Error adding Title", error: error });
    }  
});

// get all post 

app.get("/",async(req,res)=>{
    try{
        console.log("Getting all...");
        const titles = await Title.findAll();
        console.log(titles);
        res.json(titles);

    }catch(error){
        res.status(500).json({message: "Error adding Title", error: error });
    }
});

app.get("/:id", async(req,res)=>{
    try{
        const title = await Post.findByPk(req.params.id);
        res.json(title);
    }catch(error){
        res.status(500).json({message: "Error adding Title", error: error });
    }
});

// update 
app.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const post = await Title.update(
      { name },
      { where: { id: req.params.id } }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error updating Title" });
  }
});

//delete

app.delete("//:id", async (req, res) => {
  try {
    const title = await Title.destroy({ where: { id: req.params.id } });
    res.json(title);
  } catch (error) {
    res.status(500).json({ error: "Error deleting Title" });
  }
});

// export the router
module.exports = app;

