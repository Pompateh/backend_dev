function headerResizeListener() {
  let headerHeightOutput = document.querySelector(".header_demo");
  let footerHeightOutput = document.querySelector(".index-footer");

  function initializeheaderResize() {
    if (headerHeightOutput) {
      let getHeight = headerHeightOutput.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${getHeight}px`);
    }
    if (footerHeightOutput) {
      let getHeight = footerHeightOutput.offsetHeight;
      document.documentElement.style.setProperty('--index-footer-height', `${getHeight}px`);
    }
  }

  // Initialize on page load
  initializeheaderResize();

  // Reinitialize on window resize
  window.addEventListener("resize", initializeheaderResize);
}

document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navBar = document.querySelector('.nav-bar');

  if (hamburger && navBar) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navBar.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navBar.contains(event.target) && !hamburger.contains(event.target)) {
        hamburger.classList.remove('active');
        navBar.classList.remove('active');
      }
    });
  } else {
    console.error('Hamburger or nav-bar element not found');
  }

  headerResizeListener();
});