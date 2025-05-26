const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.js');
const todoRoutes = require('./routes/todos.js');

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Connect to MongoDB and start server
// console.log("Mongo URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected !"))
.catch(err => console.log("Error Occured during Connecting MongoDB !"));

app.listen(5599 , ()=>{
    console.log("Server is Running ...")
}) 