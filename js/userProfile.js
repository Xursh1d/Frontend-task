const form = document.getElementById("profile-form");
const nameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const backBtn = document.querySelector(".goback-btn");

backBtn.addEventListener("click", () => window.history.back());

function displayProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    nameInput.setAttribute("value", user.FullName);
    email.setAttribute("value", user.Email);
  } else {
    profileInfo.innerHTML = "<p>No profile found.</p>";
  }
}

displayProfile();
