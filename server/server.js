const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Disaster = require('./models/Disasters');
const Volunteer = require("./models/volunteers");
const Donation = require("./models/donations");
const Comment = require("./models/comment");

console.log("Starting server...");

const connectionString = "mongodb://localhost:27017/CrisisConnect";
const app = express();
app.use(cors());
app.use(express.json());

async function connectToMongoDB() {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
connectToMongoDB();

// Volunteer routes
app.post("/api/volunteers", async (req, res) => {
    console.log("Received request to add volunteer:", req.body);
    try {
        const newVolunteer = new Volunteer(req.body);
        console.log("Volunteer model created:", newVolunteer);
        const savedVolunteer = await newVolunteer.save();
        console.log("New volunteer saved to database:", savedVolunteer);
        res.status(201).json(savedVolunteer);
    } catch (error) {
        console.error('Error creating volunteer:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.get("/api/volunteers", async (req, res) => {
    try {
        const volunteers = await Volunteer.find({});
        res.json(volunteers);
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ... (rest of the code remains the same)

const port = 3002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
