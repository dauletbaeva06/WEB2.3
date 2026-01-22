require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const blog = require('./models/blogModel');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const DB_URL = process.env.MONGO_URL;
const PORT = 3000;

mongoose
        .connect(DB_URL)
        .then(() => {
            console.log('Connected to MongoDB')

            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        })

app.post('/blogs', async (req, res) => {
    try {
        const newBlog = new blog(req.body);
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/blogs', async (req, res) => {
    try {
        const blogs = await blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/blogs/:id', async (req, res) => {
    try {
        const { title, body, author } = req.body;
    
        if (!title || !body) {
            return res.status(400).json({ message: "Title and Body are required" });
        }

        const updatedBlog = await blog.findByIdAndUpdate(
            req.params.id, 
            { title, body, author }, 
            { new: true, runValidators: true }
        );

        if (!updatedBlog) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: "Invalid update data" });
    }
});

app.delete('/blogs/:id', async (req, res) => {
    try {
        const result = await blog.findByIdAndDelete(req.params.id); 
        if (!result) return res.status(404).json({ message: "Post not found" });
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting" });
    }
});