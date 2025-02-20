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

const moodConnection = mongoose.createConnection('mongodb+srv://kimmie:sallyDENI04@cluster.gtn1i.mongodb.net/MoodTracker?retryWrites=true&w=majority&tls=true');
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

moodConnection.on('error', console.error.bind(console, 'MongoDB MoodTracker connection error:'));
moodConnection.once('open', () => {
    console.log("Connected to the MoodTracker database");
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


const moodSchema = new mongoose.Schema({
    date: { type: String, required: true }, // Stores moods per specific date (YYYY-MM-DD)
    moods: [{
        mood: String,
        emoji: String,
        time: { type: String, default: new Date().toLocaleTimeString() }
    }]
});

const MoodEntry = moodConnection.model('MoodEntry', moodSchema, 'Moods');

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

app.get('/get-journal-entries', async (req, res) => {
    try {
        const entries = await JournalEntry.find();  
        res.json(entries);  // Send the journal entries as a JSON response
    } catch (error) {
        console.error("Error fetching journal entries:", error);
        res.status(500).json({ message: "Failed to fetch journal entries." });
    }
});

// Route to handle drawing submissions
app.post('/save-drawing', async (req, res) => {
    try {
        const { imageData } = req.body;
        const newDrawing = new DrawingEntry({ imageData });
        const savedDrawing = await newDrawing.save();

        res.status(200).json({
            message: 'Drawing saved successfully',
            drawingId: savedDrawing._id, // Ensure _id is returned correctly
        });
    } catch (err) {
        console.error('Error saving drawing:', err);
        res.status(500).json({ message: 'Error saving drawing', error: err.message });
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

app.post('/add-checklist-task', async (req, res) => {
    const { taskDescription, completed } = req.body;

    try {
        const newTask = { taskDescription, completed };
        const checklistEntry = new ChecklistEntry({ tasks: [newTask] });
        await checklistEntry.save();

        res.json({ message: "Task added successfully!", taskId: checklistEntry.tasks[0]._id });
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Failed to add task." });
    }
});

app.post('/log-mood', async (req, res) => {
    try {
        const { date, mood, emoji } = req.body;
        const entry = await MoodEntry.findOneAndUpdate(
            { date },
            { $push: { moods: { mood, emoji, time: new Date().toLocaleTimeString() } } },
            { upsert: true, new: true }
        );
        res.json({ message: "Mood logged successfully!", entry });
    } catch (error) {
        res.status(500).json({ message: "Failed to log mood.", error });
    }
});

// Route to get all journal entries
app.get('/get-moods/:date', async (req, res) => {
    const { date } = req.params;

    try {
        const entry = await MoodEntry.findOne({ date });
        res.json(entry ? entry.moods : []);
    } catch (error) {
        console.error("Error fetching moods:", error);
        res.status(500).json({ message: "Failed to fetch moods." });
    }
});



// Route to delete a mood entry by ID
app.delete('/delete-mood', async (req, res) => {
    const { date, mood, emoji, time } = req.body;

    try {
        const entry = await MoodEntry.findOne({ date });

        if (entry) {
            entry.moods = entry.moods.filter(m => !(m.mood === mood && m.emoji === emoji && m.time === time));

            if (entry.moods.length === 0) {
                await MoodEntry.deleteOne({ date }); // Delete the entry if no moods remain
            } else {
                await entry.save();
            }

            res.json({ message: "Mood deleted successfully!" });
        } else {
            res.status(404).json({ message: "Mood not found." });
        }
    } catch (error) {
        console.error("Error deleting mood:", error);
        res.status(500).json({ message: "Failed to delete mood." });
    }
});

// Route to handle journal entry deletion
app.delete('/delete-drawing/:drawingId', async (req, res) => {
    try {
        const { drawingId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(drawingId)) {
            return res.status(400).json({ message: "Invalid drawing ID" });
        }

        const result = await DrawingEntry.findByIdAndDelete(drawingId);

        if (!result) {
            return res.status(404).json({ message: "Drawing not found" });
        }

        console.log(`Drawing with ID ${drawingId} deleted successfully.`);
        res.status(200).json({ message: "Drawing deleted successfully", drawingId });

    } catch (error) {
        console.error("Error deleting drawing:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Route to get all drawings
app.get('/get-drawings', async (req, res) => {
    try {
        const drawings = await DrawingEntry.find().sort({ createdAt: -1 });
        res.json(drawings);
    } catch (error) {
        console.error("Error fetching drawings:", error);
        res.status(500).json({ message: "Failed to fetch drawings." });
    }
});

// Route to get all checklist tasks
app.get('/get-checklist', async (req, res) => {
    try {
        const checklist = await ChecklistEntry.find().sort({ createdAt: -1 });
        res.json(checklist);
    } catch (error) {
        console.error("Error fetching checklist:", error);
        res.status(500).json({ message: "Failed to fetch checklist." });
    }
});

app.delete('/delete-checklist-task/:taskId', async (req, res) => {
    const { taskId } = req.params;

    try {
        await ChecklistEntry.updateOne({}, { $pull: { tasks: { _id: taskId } } });

        res.json({ message: "Task deleted successfully!" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Failed to delete task." });
    }
});


app.delete('/delete-drawing/:drawingId', async (req, res) => {
    try {
        const { drawingId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(drawingId)) {
            return res.status(400).json({ message: "Invalid drawing ID" });
        }

        const result = await DrawingEntry.findByIdAndDelete(drawingId);

        if (result) {
            console.log(`Drawing with ID ${drawingId} deleted successfully.`);
            res.status(200).json({ message: "Drawing deleted successfully", drawingId });
        } else {
            console.log(`Drawing with ID ${drawingId} not found.`);
            res.status(404).json({ message: "Drawing not found" });
        }
    } catch (error) {
        console.error("Error deleting drawing:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

  
  
  

app.put('/update-checklist-task', async (req, res) => {
    const { taskId, completed } = req.body;

    try {
        await ChecklistEntry.updateOne(
            { "tasks._id": taskId },
            { $set: { "tasks.$.completed": completed } }
        );

        res.json({ message: "Task status updated successfully!" });
    } catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({ message: "Failed to update task status." });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});