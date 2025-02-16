document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".collapsible-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const content = this.nextElementSibling;
            content.style.display = content.style.display === "block" ? "none" : "block";
        });
    });
});
