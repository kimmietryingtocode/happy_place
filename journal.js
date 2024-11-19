const entryForm = document.querySelector('#entryForm');
const entryResultsSection = document.querySelector('#entryResultsSection');
const entryResultRow = document.querySelector('.entryResultRow');
const getEntryTitle = document.querySelector('.entry-text-title'); // Changed to querySelector for a single element
const getEntryText = document.querySelector('.entry-text-box'); // Changed to querySelector for a single element

async function addEntryToDom(event) {
    event.preventDefault();

    const entryTitle = getEntryTitle.value.trim();
    const dailyEntry = getEntryText.value.trim();

    if (!entryTitle || !dailyEntry) {
        alert("Please fill out both the title and the entry.");
        return;
    }

    // Send the data to the server
    try {
        const response = await fetch('http://localhost:3010/post', { // Adjusted to use full URL for clarity
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
    getEntryText.value = '';
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
    entryParagraph.textContent = text;

    // Append elements to entryDiv and then to entryResultRow
    entryDiv.appendChild(entryHeading);
    entryDiv.appendChild(entryDate);
    entryDiv.appendChild(entryParagraph);
    entryResultRow.appendChild(entryDiv);
}

entryForm.addEventListener('submit', addEntryToDom);