document.addEventListener('DOMContentLoaded', function () {
  // FAQ accordion (single-select: only one open at a time)
  var faqButtons = document.querySelectorAll('[data-faq-toggle]');
  faqButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var answer = button.nextElementSibling;
      var chevron = button.querySelector('[data-chevron]');
      var isOpen = !answer.classList.contains('hidden');

      // Close all FAQ items first
      faqButtons.forEach(function (otherButton) {
        var otherAnswer = otherButton.nextElementSibling;
        var otherChevron = otherButton.querySelector('[data-chevron]');
        if (otherAnswer) otherAnswer.classList.add('hidden');
        if (otherChevron) otherChevron.classList.remove('rotate-180');
      });

      // Toggle current item (if it was closed, open it)
      if (!isOpen) {
        if (answer) answer.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
      }
    });
  });

  // Mobile hamburger menu
  var menuBtn = document.getElementById('mobile-menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      menu.classList.toggle('hidden');
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu after navigation
        if (menu) menu.classList.add('hidden');
      }
    });
  });
});
