// service section
document
  .getElementById("inquiryForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("serviceName").value.trim();
    const email = document.getElementById("serviceEmail").value.trim();
    const message = document.getElementById("serviceMessage").value.trim();

    if (!name || !email || !message) {
      alert("Please Enter the Details...");
      return;
    }

    // Prepare data to send to the backend
    const formData = { name, email, message };

    // Send data using fetch API
    fetch("http://localhost:5001/submit-service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        alert("Inquiry submitted successfully!");
        console.log("Response from server:", data);
        document.getElementById("inquiryForm").reset(); // Reset form fields
      })
      .catch((error) => {
        console.error("Error while submitting form:", error);
        alert(
          "There was an issue submitting your inquiry. Please try again later."
        );
      });
  });

// Function to toggle dark mode
// function toggleTheme() {
//   const body = document.body;
//   const themeButton = document.getElementById("themeToggle");

//   // Toggle dark mode class on the body
//   body.classList.toggle("dark-mode");

//   // Change button text based on the theme
//   if (body.classList.contains("dark-mode")) {
//     themeButton.textContent = "🌞"; // Switch to light mode
//   } else {
//     themeButton.textContent = "🌙"; // Switch to dark mode
//   }
// }
