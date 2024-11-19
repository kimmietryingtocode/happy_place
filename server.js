const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 3010;

// Use CORS middleware
app.use(cors());

const drawingsConnection = mongoose.createConnection('mongodb+srv://kimmie:sallyDENI04@cluster.gtn1i.mongodb.net/Drawings?retryWrites=true&w=majority&tls=true');

// Connect to the Journal database
const journalConnection = mongoose.createConnection('mongodb+srv://kimmie:sallyDENI04@cluster.gtn1i.mongodb.net/Journal?retryWrites=true&w=majority&tls=true');

const checklistConnection = mongoose.createConnection('mongodb+srv://kimmie:sallyDENI04@cluster.gtn1i.mongodb.net/Checklist?retryWrites=true&w=majority&tls=true');
// Log connection status for both databases
drawingsConnection.on('error', console.error.bind(console, 'MongoDB Drawings connection error:'));
drawingsConnection.once('open', () => {
    console.log("Connected to the Drawings database");
});

journalConnection.on('error', console.error.bind(console, 'MongoDB Journal connection error:'));
journalConnection.once('open', () => {
    console.log("Connected to the Journal database");
});

checklistConnection.on('error', console.error.bind(console, 'MongoDB Journal connection error:'));
checklistConnection.once('open', () => {
    console.log("Connected to the Checklist database");
});

// Define the schema and model for drawings
const drawingSchema = new mongoose.Schema({
    imageData: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const DrawingEntry = drawingsConnection.model('DrawingEntry', drawingSchema, 'Drawings');

// Define the schema and model for journal entries
const journalEntrySchema = new mongoose.Schema({
    entryTitle: {
        type: String,
        required: true,
        trim: true,
    },
    dailyEntry: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const JournalEntry = journalConnection.model('JournalEntry', journalEntrySchema, 'Entries');

// Define the schema and model for checklist entries
const checklistEntrySchema = new mongoose.Schema({
    tasks: [{
        taskDescription: String,
        completed: Boolean,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const ChecklistEntry = checklistConnection.model('ChecklistEntry', checklistEntrySchema, 'Tasks');


// Middleware to serve static files
app.use(express.static(path.join(__dirname)));

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the HTML file for the journal app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'journal.html'));
});

// Route to handle journal entry submissions
app.post('/post', async (req, res) => {
    const { entryTitle, dailyEntry } = req.body;

    try {
        const journalEntry = new JournalEntry({ entryTitle, dailyEntry });
        await journalEntry.save();
        console.log("Journal entry saved successfully:", journalEntry);
        res.json({ message: "Journal entry saved successfully!" });
    } catch (error) {
        console.error("Error saving journal entry:", error);
        res.status(500).json({ message: "Failed to save journal entry." });
    }
});

// Route to handle drawing submissions
app.post('/save-drawing', async (req, res) => {
    const { imageData } = req.body;

    try {
        const drawingEntry = new DrawingEntry({ imageData });
        await drawingEntry.save();
        console.log("Drawing saved successfully:", drawingEntry);
        res.json({ message: "Drawing saved successfully!" });
    } catch (error) {
        console.error("Error saving drawing:", error);
        res.status(500).json({ message: "Failed to save drawing." });
    }
});


// Route to handle checklist submission
app.post('/submit-checklist', async (req, res) => {
    const { tasks } = req.body;

    try {
        const checklistEntry = new ChecklistEntry({ tasks });
        await checklistEntry.save();
        console.log("Checklist entry saved successfully:", checklistEntry);
        res.json({ message: "Checklist entry saved successfully!" });
    } catch (error) {
        console.error("Error saving checklist entry:", error);
        res.status(500).json({ message: "Failed to save checklist entry." });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});