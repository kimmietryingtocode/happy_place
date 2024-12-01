let previousScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  // Get current scroll position
  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  // Show or hide header based on scroll direction
  if (currentScrollPosition > previousScrollPosition && currentScrollPosition > 100) {
    // Scrolling down
    header.style.transform = "translateY(-100%)"; // Hide header
  } else {
    // Scrolling up
    header.style.transform = "translateY(0)"; // Show header
  }

  // Change header background when scrolling past a certain point
  if (currentScrollPosition >= 740) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Update the previous scroll position
  previousScrollPosition = currentScrollPosition;
});

function goToPlace() {
  window.location.href = 'place.html'; // Replace 'place.html' with the actual path if it's in a subdirectory
}