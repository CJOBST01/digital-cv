document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggleFormBtn");
  const formWrapper = document.getElementById("contactFormWrapper");

  if (toggleBtn && formWrapper) {
    toggleBtn.addEventListener("click", function () {
      const isVisible = formWrapper.classList.toggle("show");
      toggleBtn.textContent = isVisible ? "Close" : "Contact Me";
    });
  }
});