const colorButtons = document.querySelectorAll('.color-button');

colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedColor = button.dataset.color;
        document.body.style.backgroundColor = selectedColor;
    });
});
