// Add event listener to hamburger menu button
function toggleHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const navbarMiddle = document.querySelector('.navbar-middle');

  hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    navbarMiddle.classList.toggle('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  toggleHamburgerMenu();
});