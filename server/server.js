const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors");
const Disaster = require('./models/Disasters')
const Volunteer = require("./models/volunteers")
const Donation = require("./models/donations")
const Comment = require("./models/comment")

const connectionString = "mongodb://localhost:27017/CrisisConnect";
const app = express()
app.use(cors())
app.use(express.json())

//================================Connecting to dataBase======
async function connectToMongoDB() {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
connectToMongoDB();

//==================Endpoint related to  disasters===========
app.post("/addDisaster", async (req, res) => {
    const body = req.body;
    try {
        const newDisaster = await Disaster.create(body)
        await newDisaster.save();
        res.status(201).json({ msg: "New Disaster uploaded...!" })
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
})

//==========================endpoints related to volunteers==============
app.post("/api/volunteers", async (req, res) => {
    try {
        const volunteer = new Volunteer(req.body);
        await volunteer.save();
        res.status(201).json(volunteer);
    } catch (error) {
        console.error('Error creating volunteer:', error);
        res.status(500).json({ error: 'Failed to create volunteer' });
    }
});

app.get("/api/volunteers", async (req, res) => {
    try {
        const volunteers = await Volunteer.find({});
        res.json(volunteers);
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        res.status(500).json({ error: 'Failed to fetch volunteers' });
    }
});

app.get("/getVolunteer/:id", async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ message: "Volunteer not found" });
        }
        res.json(volunteer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/countVolunteer", async (req, res) => {
    try {
        const count = await Volunteer.countDocuments();
        res.json(count)
    } catch (err) {
        console.error("Error while finding the no of volunteers:", err);
        res.status(500).json({ error: "Failed to count volunteers" });
    }
});

app.get('/volunteers/emails', async (req, res) => {
    try {
        const emails = await Volunteer.find({}, 'email');
        const emailList = emails.map(volunteer => volunteer.email);
        res.status(200).json(emailList);
    } catch (error) {
        console.error('Error retrieving emails:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//=====================Endpoints related to Donations=========
app.get("/getDonations", (req, res) => {
    Donation.find({}).then(Donations => res.json(Donations)).catch(err => res.json(err));
});

app.post("/addDonation", async (req, res) => {
    const body = req.body;
    try {
        const newDonation = await Donation.create(body)
        await newDonation.save();
        res.status(201).json({ msg: "New Donation Successful...!" })
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
});

app.get("/totalDonations", async (req, res) => {
    try {
        const totalDonations = await Donation.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        if (totalDonations.length > 0) {
            res.json({ totalDonations: totalDonations[0].totalAmount });
        } else {
            res.json({ totalDonations: 0 });
        }
    } catch (error) {
        console.error("Error while calculating total donations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//=============================routes related to comments==================================
app.post('/comments', async (req, res) => {
    try {
        const { disasterId, name, comment } = req.body;
        const newComment = new Comment({
            disasterId,
            name,
            comment
        });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/comments/:disasterId', async (req, res) => {
    try {
        const { disasterId } = req.params;
        const comments = await Comment.find({ disasterId });
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
