document.addEventListener("DOMContentLoaded", async function () {
    await fetchJournalEntries(); // Fetch stored entries when the page loads
});

// Select necessary elements
const entryForm = document.querySelector('#entryForm');
const entryResultRow = document.querySelector('.entryResultRow');
const getEntryTitle = document.querySelector('.entry-text-title');
const getEntryText = document.querySelector('.entry-text-box');

// Fetch and display all journal entries from the server
async function fetchJournalEntries() {
    try {
        const response = await fetch('http://localhost:3010/get-journal-entries');
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const entries = await response.json();
        entries.forEach(entry => {
            displayEntry(entry.entryTitle, entry.dailyEntry, entry.createdAt);
        });
    } catch (error) {
        console.error("Error fetching journal entries:", error);
    }
}

// Function to add a new journal entry
async function addEntryToDom(event) {
    event.preventDefault();

    const entryTitle = getEntryTitle.value.trim();
    const dailyEntry = getEntryText.value.trim();

    if (!entryTitle || !dailyEntry) {
        alert("Please fill out both the title and the entry.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3010/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entryTitle, dailyEntry }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result.message);

        // Display the newly added entry
        displayEntry(entryTitle, dailyEntry, new Date().toISOString());
    } catch (error) {
        console.error("Failed to submit entry:", error);
        alert("Failed to submit the journal entry. Please check the console for more details.");
    }

    // Clear input fields after submission
    getEntryTitle.value = '';
    getEntryText.value = '';
}

// Function to display a journal entry on the page
function displayEntry(title, text, createdAt) {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'single-entry-div';

    const entryHeading = document.createElement('h3');
    entryHeading.className = 'single-entry-heading';
    entryHeading.textContent = title;

    const entryDate = document.createElement('p');
    entryDate.className = 'single-entry-date';
    entryDate.textContent = `Date Added: ${new Date(createdAt).toLocaleDateString()}`;

    const entryParagraph = document.createElement('p');
    entryParagraph.className = 'single-entry-text';
    entryParagraph.textContent = text;

    entryDiv.appendChild(entryHeading);
    entryDiv.appendChild(entryDate);
    entryDiv.appendChild(entryParagraph);
    entryResultRow.appendChild(entryDiv);
}

// Attach event listener for form submission
entryForm.addEventListener('submit', addEntryToDom);
