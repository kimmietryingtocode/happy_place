document.addEventListener("DOMContentLoaded", () => {

    
    function createToolbar() {
        const tools = [
            { 
                iconFile: "images/pen-nib-solid.svg",
                component: createJournal
            },
            { 
                iconFile: "images/palette-solid.svg",
                htmlFile: "whiteboard.html"
            },
            { 
                iconFile: "images/clipboard-check-solid.svg",
                component: createChecklist
            },
            { 
                iconFile: "images/swatchbook-solid.svg",
                component: createMoodChecker
            }
        ];
    
        const toolbar = document.createElement("div");
        toolbar.classList.add("toolbar");
        toolbar.style.position = "fixed";
        toolbar.style.top = "10px";
        toolbar.style.left = "10px";
    
        tools.forEach(tool => {
            const button = document.createElement("button");
            button.classList.add("toolbar__button");
            const img = document.createElement("img");
            img.src = tool.iconFile;
            img.alt = tool.label || "Icon";
            img.classList.add("toolbar__icon");
            button.appendChild(img);
            if (tool.htmlFile) {
                button.addEventListener("click", () => openWindow(tool.htmlFile));
            } else if (tool.component) {
                button.addEventListener("click", tool.component);
            }
            toolbar.appendChild(button);
        });
    
        document.body.appendChild(toolbar);
        dragElement(toolbar);
    }

    function openWindow(htmlFile) {
        const popup = document.createElement("div");
        popup.classList.add("journal-popup");
        popup.style.position = "absolute";
        popup.style.top = "20px";
        popup.style.left = "20px";
        popup.style.width = "400px";
        popup.style.height = "300px";

        const closeButton = document.createElement("span");
        closeButton.classList.add("close-button");
        closeButton.innerHTML = "&times;";
        closeButton.onclick = () => document.body.removeChild(popup);

        const header = document.createElement("div");
        header.classList.add("journal-header");
        header.innerText = "";
        header.appendChild(closeButton);

        const iframe = document.createElement("iframe");
        iframe.src = htmlFile;
        iframe.classList.add("journal-iframe");

        popup.appendChild(header);
        popup.appendChild(iframe);

        const resizeHandle = document.createElement("div");
        resizeHandle.classList.add("resize-handle");
        popup.appendChild(resizeHandle);

        document.body.appendChild(popup);
        dragElement(popup);
        makeResizable(popup, resizeHandle);
    }

    function createJournal() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'journalWin.css'; // Path to the CSS file
        link.type = 'text/css';
        document.head.appendChild(link);

        const journal = document.createElement("div");
        journal.classList.add("journal");

        const header = document.createElement("div");
        header.classList.add("header");

        const closeButton = document.createElement("span");
        closeButton.classList.add("close-button");
        closeButton.innerHTML = "&times;";
        closeButton.onclick = () => document.body.removeChild(journal);

        header.appendChild(closeButton);


        const content = document.createElement("div");
        content.innerHTML = `
            <section class="section journal-section">
                <div class="container">
                    <div class="container-row container-row-journal">
                        <div class="container-item container-item-journal">
                            <form id="entryForm">
                                <label for="entry-title" class="journal-label">Entry Title</label>
                                <input type="text" name="entryTitle" id="entry-title" class="entry-text-title" placeholder="Name of entry ✏️" required />
                                <label for="entry" class="journal-label">Today's Entry</label>
                                <textarea name="dailyEntry" id="entry" class="entry-text-box" placeholder="What's on your mind today? 💭" required></textarea>
                                <button class="btn-main entry-submit-btn" type="submit">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Journal Entry Results -->
            <section class="section sectionEntryResults" id="entryResultsSection">
                <div class="container">
                    <div class="container-row entryResultRow"></div>
                </div>
            </section>
        `;

        journal.appendChild(header);
        journal.appendChild(content);

        const resizeHandle = document.createElement("div");
        resizeHandle.classList.add("resize-handle");
        journal.appendChild(resizeHandle);

        document.body.appendChild(journal);

        dragElement(journal);
        makeResizable(journal, resizeHandle);

        // Select elements from the newly created content
        const entryForm = journal.querySelector('#entryForm');
        const entryResultRow = journal.querySelector('.entryResultRow');
        const getEntryTitle = journal.querySelector('.entry-text-title');
        const getEntryText = journal.querySelector('.entry-text-box');

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
            if (!journal.querySelector('.heading-results')) {
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
    }

    function createMoodChecker() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'moodBackgroundWin.css'; // Path to the CSS file
        link.type = 'text/css';
        document.head.appendChild(link);
        const moodChecker = document.createElement("div");
        moodChecker.classList.add("mood-checker");

        const header = document.createElement("div");
        header.classList.add("header");

        const closeButton = document.createElement("span");
        closeButton.classList.add("close-button");
        closeButton.innerHTML = "&times;";
        closeButton.onclick = () => document.body.removeChild(moodChecker);

        header.appendChild(closeButton);

        const content = document.createElement("div");
        content.innerHTML = `
            <h2>How are you feeling today?</h2>
            <button class="color-button" data-color="#FFF098">Excited</button>
            <button class="color-button" data-color="#E0F5AF">Calm</button>
            <button class="color-button" data-color="#DAF6F2">Happy</button>
            <button class="color-button" data-color="#39427D">Sad</button>
            <button class="color-button" data-color="#C49CB1">Anxious</button>
            <button class="color-button" data-color="#D6CEB6">Apathetic</button>
            <button class="color-button" data-color="#D95C5C">Angry</button>
        `;

        const buttons = content.querySelectorAll(".color-button");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                document.body.style.backgroundColor = button.dataset.color;
            });
        });

        moodChecker.appendChild(header);
        moodChecker.appendChild(content);

        const resizeHandle = document.createElement("div");
        resizeHandle.classList.add("resize-handle");
        moodChecker.appendChild(resizeHandle);

        document.body.appendChild(moodChecker);

        dragElement(moodChecker);
        makeResizable(moodChecker, resizeHandle);

        const colorButtons = content.querySelectorAll('.color-button');
        colorButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedColor = button.dataset.color;
                const relativeColor = getRelativeColor(selectedColor);
                document.body.style.background = `linear-gradient(132deg, ${selectedColor}, ${relativeColor})`;
                document.body.style.backgroundSize = '400% 400%';
                document.body.style.animation = 'BackgroundGradient 15s ease infinite';
            });
        });

        function getRelativeColor(hex) {
            // Convert hex to RGB
            let r = parseInt(hex.slice(1, 3), 16);
            let g = parseInt(hex.slice(3, 5), 16);
            let b = parseInt(hex.slice(5, 7), 16);
        
            // Boost the RGB values for a neon effect
            // Shift hue slightly and amplify the color vibrancy
            r = Math.min(255, Math.round(r * 1.5) % 256); // Boost and wrap around
            g = Math.min(255, Math.round(g * 1.5) % 256); // Boost and wrap around
            b = Math.min(255, Math.round(b * 1.5) % 256); // Boost and wrap around
        
            // Create a vibrant neon-like mix
            if (r < 128) r += 128; // Ensure at least one channel has high brightness
            if (g < 128) g += 128;
            if (b < 128) b += 128;
        
            // Convert RGB back to hex
            const newColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            return newColor;
        }
    }

    function createChecklist() {
        // Import CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'checklistWin.css'; // Path to the CSS file
        link.type = 'text/css';
        document.head.appendChild(link);
    
        // Create the checklist container
        const checklist = document.createElement("div");
        checklist.classList.add("checklist");
    
        // Create the header with close button
        const header = document.createElement("div");
        header.classList.add("header");
    
        const closeButton = document.createElement("span");
        closeButton.classList.add("close-button");
        closeButton.innerHTML = "&times;";
        closeButton.onclick = () => document.body.removeChild(checklist);
    
        header.appendChild(closeButton);
    
        // Create content for the checklist
        const content = document.createElement("div");
        content.innerHTML = `
            <h2>Today, Did you...?</h2>
            <!-- Checklist Container -->
            <div id="checklistContainer">
                <div class="checklist-item">
                    <input type="checkbox" id="task1">
                    <input type="text" id="task1Text" placeholder="Brush Your Teeth?">
                    <button class="delete-button"><img src="images/xmark-solid.svg" alt="Delete"></button>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" id="task2">
                    <input type="text" id="task2Text" placeholder="Eat Food?">
                    <button class="delete-button"><img src="images/xmark-solid.svg" alt="Delete"></button>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" id="task3">
                    <input type="text" id="task3Text" placeholder="Drink Water?">
                    <button class="delete-button"><img src="images/xmark-solid.svg" alt="Delete"></button>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" id="task4">
                    <input type="text" id="task4Text" placeholder="Clean Your Desk?">
                    <button class="delete-button"><img src="images/xmark-solid.svg" alt="Delete"></button>
                </div>
            </div>
            <!-- Input for New Task -->
            <input type="text" class="input" id="taskInput" placeholder="Add a new task description">
            <button class="addbtn" id="addBtn">Add Task</button>
            <button class="submitbtn" id="submitBtn">Submit</button>
        `;
    
        // Append header and content to the checklist container
        checklist.appendChild(header);
        checklist.appendChild(content);
    
        // Add checklist to the document body
        document.body.appendChild(checklist);
    
        // Function to add a new task
        function addNewItem() {
            const taskDescription = document.getElementById('taskInput').value;
            if (taskDescription.trim() !== '') {
                document.getElementById('taskInput').value = ''; // Clear input field
    
                // Create a new checklist item container
                const newItem = document.createElement('div');
                newItem.className = 'checklist-item';
    
                // Create the checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
    
                // Create the text input for the task
                const taskInput = document.createElement('input');
                taskInput.type = 'text';
                taskInput.value = taskDescription;
                taskInput.placeholder = 'New Task';
    
                // Create the delete button
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.innerHTML = '<img src="images/xmark-solid.svg" alt="Delete">';
                deleteButton.onclick = () => deleteTask(deleteButton);
    
                // Append elements to the new checklist item
                newItem.appendChild(checkbox);
                newItem.appendChild(taskInput);
                newItem.appendChild(deleteButton);
    
                // Append the new item to the checklist container
                document.getElementById('checklistContainer').appendChild(newItem);
            }
        }
    
        // Event listener for adding tasks
        document.getElementById('addBtn').addEventListener('click', addNewItem);
    
        // Function to delete a task
        function deleteTask(button) {
            const taskItem = button.parentElement;
            taskItem.remove();
        }
    
        // Function to submit the checklist
        function submitChecklist() {
            const tasks = [];
            const taskItems = document.querySelectorAll('.checklist-item');
    
            // Loop through each checklist item and get the task description and completion status
            taskItems.forEach(taskItem => {
                const checkbox = taskItem.querySelector('input[type="checkbox"]');
                const taskInput = taskItem.querySelector('input[type="text"]');
    
                // Get task description (use placeholder if text is empty)
                const taskDescription = taskInput.value.trim() || taskInput.placeholder;
                const completed = checkbox.checked;
    
                // Add task data to the array
                tasks.push({ taskDescription, completed });
            });
    
            // Send the tasks data to the server
            fetch('http://localhost:3010/submit-checklist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tasks }),
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                console.error("Error submitting checklist:", error);
                alert("Failed to submit the checklist. Please check the console for more details.");
            });
        }
    
        document.getElementById('submitBtn').addEventListener('click', submitChecklist);
    
        // Call drag and resize functions if needed (assuming they exist)
        dragElement(checklist);
        const resizeHandle = document.createElement("div");
        resizeHandle.classList.add("resize-handle");
        checklist.appendChild(resizeHandle);
        makeResizable(checklist, resizeHandle);
    }

    function dragElement(element) {
        let posX = 0, posY = 0, startX = 0, startY = 0;
        const header = element.querySelector(".header") || element;
        header.style.cursor = 'move';
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            document.onmousemove = elementDrag;
            document.onmouseup = closeDragElement;
        }

        function elementDrag(e) {
            e.preventDefault();
            posX = startX - e.clientX;
            posY = startY - e.clientY;
            startX = e.clientX;
            startY = e.clientY;

            let newTop = element.offsetTop - posY;
            let newLeft = element.offsetLeft - posX;

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const elementWidth = element.offsetWidth;
            const elementHeight = element.offsetHeight;

            if (newTop < 0) newTop = 0;
            if (newLeft < 0) newLeft = 0;
            if (newTop + elementHeight > viewportHeight) newTop = viewportHeight - elementHeight;
            if (newLeft + elementWidth > viewportWidth) newLeft = viewportWidth - elementWidth;

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function makeResizable(element, handle) {
        let startX = 0, startY = 0, startWidth = 0, startHeight = 0;

        handle.onmousedown = function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent triggering drag events
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
            document.addEventListener('mousemove', resizeElement);
            document.addEventListener('mouseup', stopResizeElement);
        };

        function resizeElement(e) {
            const newWidth = startWidth + e.clientX - startX;
            const newHeight = startHeight + e.clientY - startY;
            element.style.width = (newWidth > 150 ? newWidth : 150) + "px";
            element.style.height = (newHeight > 150 ? newHeight : 150) + "px";
        }

        function stopResizeElement() {
            document.removeEventListener('mousemove', resizeElement);
            document.removeEventListener('mouseup', stopResizeElement);
        }
    }

    createToolbar();
});