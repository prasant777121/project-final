// Add this to your existing scripts.js file

window.addEventListener('scroll', function() {
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach((element) => {
      const offset = window.pageYOffset;
      element.style.backgroundPositionY = offset * 0.7 + 'px';
    });
  });
  