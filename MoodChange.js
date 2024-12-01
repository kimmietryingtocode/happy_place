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