document.addEventListener("DOMContentLoaded", () => {
  // 1. Dark Mode Toggle
  const themeToggleBtn = document.getElementById("theme-toggle");
  const body = document.body;

  themeToggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    themeToggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  });

  // 2. Interactive Greeting Button
  const greetBtn = document.getElementById("greet-btn");
  greetBtn.addEventListener("click", () => {
    const visitorName = prompt("What's your name?");
    if (visitorName && visitorName.trim() !== "") {
      alert(`Hello, ${visitorName.trim()}! Welcome to Rene's website.`);
    } else {
      alert("Hello there! Welcome to Rene's website.");
    }
  });

  // 3. Smooth Scrolling for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // 4. Contact Form Submission Feedback
  const contactForm = document.getElementById("contact-form");
  const feedbackMsg = document.getElementById("form-feedback");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    
    feedbackMsg.textContent = `Thanks, ${name}! Your message has been sent to Rene.`;
    contactForm.reset();

    // Clear the success message after 5 seconds
    setTimeout(() => {
      feedbackMsg.textContent = "";
    }, 5000);
  });
});