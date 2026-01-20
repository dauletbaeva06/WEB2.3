require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const blog = require('./models/blogModel');
const app = express();
const cors = require('cors');

const DB_URL = process.env.MONGO_URL;
const PORT = 3000;

app.use(express.json());
app.use(cors());

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
