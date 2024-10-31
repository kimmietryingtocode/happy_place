const entryForm = document.querySelector('#entryForm');
const entryResultsSection = document.querySelector('#entryResultsSection');
const entryResultRow = document.querySelector('.entryResultRow');
const getEntryTitle = document.querySelectorAll('.entry-text-title'); // Using querySelectorAll for consistency
const getEntryText = document.querySelectorAll('.entry-text-box');

async function addEntryToDom(event) {
    event.preventDefault();

    const entryTitle = getEntryTitle[0].value;
    const dailyEntry = getEntryText[0].value;

    // Send the data to the server
    try {
        const response = await fetch('/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entryTitle, dailyEntry }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log(result.message);
            displayEntry(entryTitle, dailyEntry);
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error("Failed to submit entry:", error);
    }

    // Clear input fields after submission
    getEntryTitle[0].value = '';
    getEntryText[0].value = '';
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