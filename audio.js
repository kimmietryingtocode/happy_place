// Object to store sound elements
const sounds = {
    rain: new Audio('rain.mp3'),
    forest: new Audio('forest.mp3'),
    ocean: new Audio('ocean.mp3')
};

// Function to toggle play/pause for a sound
function toggleSound(soundKey, button) {
    const sound = sounds[soundKey];
    
    if (sound.paused) {
        // Pause any other playing sound
        Object.keys(sounds).forEach(key => {
            if (key !== soundKey) {
                sounds[key].pause();
                sounds[key].currentTime = 0;
                const otherButton = document.querySelector(`.play-btn[data-sound="${key}"]`);
                if (otherButton) {
                    otherButton.textContent = key.charAt(0).toUpperCase() + key.slice(1);
                }
            }
        });

        // Play the selected sound
        sound.loop = true;
        sound.play();
        button.textContent = `Stop ${soundKey.charAt(0).toUpperCase() + soundKey.slice(1)}`;
    } else {
        // Pause the selected sound
        sound.pause();
        sound.currentTime = 0;
        button.textContent = soundKey.charAt(0).toUpperCase() + soundKey.slice(1);
    }
}

// Add event listeners to all buttons
const buttons = document.querySelectorAll('.play-btn');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const soundKey = button.getAttribute('data-sound');
        toggleSound(soundKey, button);
    });
});
