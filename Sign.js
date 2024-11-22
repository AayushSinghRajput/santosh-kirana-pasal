document
  .getElementById("signupForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevents the form from submitting the default way

    // Retrieve the form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Simple client-side validation before sending the request
    if (!name || !email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      // Send data to the server
      const response = await fetch("http://localhost:5001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json(); // Parse the response as JSON

      // Check if the signup was successful
      if (response.ok) {
        alert("Signup successful!");
        window.location.href = "Login.html"; // Redirect to the login page
      } else {
        alert(data.error || data.message || "An error occurred."); // Show appropriate error message
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  });
