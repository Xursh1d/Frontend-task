const user_profile = document.getElementById("user_profile");
const log_out = document.querySelector(".log-out");
const burger = document.querySelector(".burger-icon");
const menu_bar = document.querySelector(".menu-bar");
const getUser = JSON.parse(localStorage.getItem("user"));
user_profile.innerHTML = getUser.FullName;
const token = new URLSearchParams({
  RefreshToken: getUser.RefreshToken,
}).toString();
log_out.addEventListener("click", async () => {
  await fetch("https://quiz.1kb.uz/api/Auth/logout?" + token, {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error logging out user");
      }
      localStorage.removeItem("user");
      window.location.href = "logIn.html";
    })
    .catch((error) => {
      console.error("Error logging out user:", error);
    });
});
burger.addEventListener("click", () => {
  menu_bar.classList.toggle("show");
});
