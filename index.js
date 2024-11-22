// contact section
document
  .getElementById("contactForm") // Attach the event listener to the form
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !message) {
      alert("Please Enter the Details...");
      return;
    }

    // Data to send to the backend
    const formData = { name, email, message };

    fetch("http://localhost:5001/submit-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit form");
        }
        return response.json();
      })
      .then((data) => {
        alert("Message Submitted Successfully!");
        console.log("Response from server:", data);
        document.getElementById("contactForm").reset(); // Reset the form fields
      })
      .catch((error) => {
        console.error("Error submitting the form:", error);
        alert("An error occurred while submitting the form. Please try again.");
      });
  });

// add to cart logic
function addToCart() {
  alert("Added to Cart");
}

//buy now logic
function buynow() {
  alert("Product Purchased !");
}

//logic to increase and decrease the quantity

// Function to increase quantity
function increaseQuantity(button) {
  const quantitySpan = button.parentElement.querySelector(".quantity");
  let quantity = parseInt(quantitySpan.innerText, 10);
  quantity++;
  quantitySpan.innerText = quantity;
  // console.log("Number increased to:", quantity);
}

// Function to decrease quantity, but not below 0
function decreaseQuantity(button) {
  const quantitySpan = button.parentElement.querySelector(".quantity");
  let quantity = parseInt(quantitySpan.innerText, 10);
  if (quantity > 0) {
    quantity--;
    quantitySpan.innerText = quantity;
    // console.log("Number decreased to:", quantity);
  }
}

// JavaScript function to filter products based on search input
function searchProducts(event) {
  event.preventDefault(); // Prevent form submission

  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const products = document.querySelectorAll(".product"); // Select all products

  products.forEach((product) => {
    const productName = product.getAttribute("data-name").toLowerCase();

    // Check if the product name matches the search input
    if (productName.includes(searchInput)) {
      product.style.display = "block"; // Show matching product
    } else {
      product.style.display = "none"; // Hide non-matching product
    }
  });
}

// Function to toggle dark mode
function toggleTheme() {
  const body = document.body;
  const themeButton = document.getElementById("themeToggle");

  // Toggle dark mode class on the body
  body.classList.toggle("dark-mode");

  // Change button text based on the theme
  if (body.classList.contains("dark-mode")) {
    themeButton.textContent = "🌞"; // Switch to light mode
    localStorage.setItem("theme", "dark"); //save theme to localstorage
  } else {
    themeButton.textContent = "🌙"; // Switch to dark mode
    localStorage.setItem("theme", "light"); //save theme to localstorage
  }
}
// Apply theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("themeToggle").textContent = "🌞";
  }
});

// checking if the user has a valid token in localstorage
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token, redirect to signup/login page
    window.location.href = "Sign.html";
  } else {
    // Optionally, verify token with backend
    fetch("http://localhost:5001/verify-token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Token invalid or expired.");
        }
        // User is authenticated
      })
      .catch(() => {
        localStorage.removeItem("token"); // Clear invalid token
        window.location.href = "Sign.html";
      });
  }
});
