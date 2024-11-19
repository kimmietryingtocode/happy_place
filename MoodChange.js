const colorButtons = document.querySelectorAll('.color-button');

colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedColor = button.dataset.color;
        const relativeColor = getRelativeColor(selectedColor);
        document.body.style.background = `linear-gradient(132deg, ${selectedColor}, ${relativeColor})`;
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'BackgroundGradient 15s ease infinite';
    });
});

// Function to generate a relative color by manipulating the brightness
function getRelativeColor(hex) {
    // Convert hex to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    // Generate a tertiary color (shift hue slightly)
    // You can tweak these values to get a more suitable tertiary shade
    r = Math.round((r + 180) % 256);
    g = Math.round((g + 150) % 256);
    b = Math.round((b + 120) % 256);

    // Blend with white to create a pastel effect
    r = Math.round((r + 255) / 2); // Blend with white (255)
    g = Math.round((g + 255) / 2); // Blend with white (255)
    b = Math.round((b + 255) / 2); // Blend with white (255)

    // Convert RGB back to hex
    const newColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    return newColor;
}