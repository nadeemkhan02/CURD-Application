const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://localhost/blogs", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
    process.exit(1); // Terminate the application if connection fails
  });

const blogDataSchema = new mongoose.Schema({
  title: String,
  sub_title: String,
  post_desc: String,
  email: String,
  isPublished: Boolean,
  blogType: String,
});

const BlogData = mongoose.model("BlogData", blogDataSchema);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/addBlog", async (req, res) => {
  const payload = req.body;

  try {
    const blogData = new BlogData(payload);
    await blogData.validate(); // Validate the data against the schema
    const savedBlog = await blogData.save();
    res.send(savedBlog);
  } catch (error) {
    res.status(400).send("Invalid blog data provided!");
  }
});

app.get("/getBlogs", async (req, res) => {
  try {
    const blogData = await BlogData.find();
    res.send(blogData);
  } catch (error) {
    res.status(500).send("An error occurred while fetching the blogs.");
  }
});

app.get("/getBlogById/:id", async (req, res) => {
  const blogId = req.params.id;

  try {
    const blogData = await BlogData.findById(blogId);
    if (!blogData) {
      return res.status(400).send("Invalid blogId provided!");
    }
    res.send(blogData);
  } catch (error) {
    res.status(500).send("An error occurred while fetching the blog.");
  }
});

app.put("/updateBlog/:id", async (req, res) => {
  const blogId = req.params.id;
  const payload = req.body;

  try {
    const updatedBlog = await BlogData.findByIdAndUpdate(blogId, payload, {
      new: true,
    });
    if (!updatedBlog) {
      return res.status(400).send("Invalid blogId provided!");
    }
    res.send(updatedBlog);
  } catch (error) {
    res.status(500).send("An error occurred while updating the blog.");
  }
});

app.delete("/deleteBlog/:id", async (req, res) => {
  const blogId = req.params.id;

  try {
    const deletedBlog = await BlogData.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(400).send("Invalid blogId provided!");
    }
    res.send("Blog deleted successfully");
  } catch (error) {
    res.status(500).send("An error occurred while deleting the blog.");
  }
});

app.listen(9000, () => {
  console.log("App listening on port 9000");
});
