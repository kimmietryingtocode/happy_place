const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const port = 3010

const app = express()
app.use(express.static(__dirname))
app.use(express.urlencoded({extended: true}))

mongoose.connect('mongodb://localhost:27017/')

const db = mongoose.connection

db.once('open', () => {
    console.log("Mongodb connection established")
})

const journalEntrySchema = new mongoose.Schema({
    entryTitle: {
        type: String,
        required: true,
        trim: true
      },
      dailyEntry: {
        type: String,
        required: true,
        trim: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
})

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'jounrnal.html'))
})

app.post('/post',(req,res) => {
    const journalEntry = new JournalEntry {
        entryTitle,
        dailyEntry,
        createdAt
    }
    await journalEntry.save()
    console.log(journalEntry)
})

app.listen(port, ()=> {
    console.log("Server established")
}
)