const entryForm = document.querySelector('#entryForm');
const entryResultsSection = document.querySelector('#entryResultsSection');
const entryResultRow = document.querySelector('.entryResultRow');
const getEntryTitle = document.querySelector('.entry-text-title'); // Single title input
const getEntryText = document.querySelector('.entry-text-box'); // Contenteditable div
const boldBtn = document.querySelector('#boldBtn');
const italicBtn = document.querySelector('#italicBtn');
const underlineBtn = document.querySelector('#underlineBtn');

// Function to apply formatting
function formatText(button, command) {
    document.execCommand(command, false, null); // Apply the formatting command
    button.classList.toggle('active'); // Toggle the "active" class
}

// Attach event listeners to formatting buttons
boldBtn.addEventListener('click', () => formatText(boldBtn,'bold'));
italicBtn.addEventListener('click', () => formatText(italicBtn,'italic'));
underlineBtn.addEventListener('click', () => formatText(underlineBtn,'underline'));



// Add entry to DOM
async function addEntryToDom(event) {
    event.preventDefault();

    const entryTitle = getEntryTitle.value.trim();
    const dailyEntry = getEntryText.innerHTML.trim(); // Use innerHTML to preserve formatting

    if (!entryTitle || !dailyEntry) {
        alert("Please fill out both the title and the entry.");
        return;
    }

    // Send the data to the server
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
        displayEntry(entryTitle, dailyEntry);
    } catch (error) {
        console.error("Failed to submit entry:", error);
        alert("Failed to submit the journal entry. Please check the console for more details.");
    }

    // Clear input fields after submission
    getEntryTitle.value = '';
    getEntryText.innerHTML = ''; // Clear the rich text editor
}

// Function to display entry on the page
function displayEntry(title, text) {
    const d = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();

    // Add heading only once
    if (!document.querySelector('.heading-results')) {
        const heading = document.createElement('h2');
        heading.className = 'heading-results';
        heading.textContent = 'Journal Entries';
        entryResultRow.insertAdjacentElement('beforebegin', heading);
    }

    // Create entry container
    const entryDiv = document.createElement('div');
    entryDiv.className = 'single-entry-div';

    const entryHeading = document.createElement('h3');
    entryHeading.className = 'single-entry-heading';
    entryHeading.textContent = title;

    const entryDate = document.createElement('p');
    entryDate.className = 'single-entry-date';
    entryDate.textContent = `Date Added: ${day} ${month} ${year}`;

    const entryParagraph = document.createElement('p');
    entryParagraph.className = 'single-entry-text';
    entryParagraph.innerHTML = text; // Use innerHTML to preserve formatting

    // Append elements to entryDiv and then to entryResultRow
    entryDiv.appendChild(entryHeading);
    entryDiv.appendChild(entryDate);
    entryDiv.appendChild(entryParagraph);
    entryResultRow.appendChild(entryDiv);
}

entryForm.addEventListener('submit', addEntryToDom);
