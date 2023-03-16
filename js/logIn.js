const loginForm = document.getElementById("login-form");
const loginBtn = document.getElementById("login-btn");

const password = document.getElementById("password");
const username = document.getElementById("username");

username.addEventListener("input", () => {
  if (username.value.trim() === "") {
    document.querySelector(".email-validation").innerHTML =
      "Please enter a valid email address !";
    document.getElementById("username").style.borderColor = "red";
    return;
  }
  if (
    !username.value.includes("@") ||
    username.value.indexOf("@") === 0 ||
    username.value.indexOf("@") === username.value.length - 1
  ) {
    document.querySelector(".email-validation").innerHTML =
      "Please enter a valid email address !";
    document.getElementById("username").style.borderColor = "red";
    return;
  } else {
    document.querySelector(".email-validation").innerHTML = "";
    username.style.borderColor = "";
  }
});

password.addEventListener("input", () => {
  if (password.value.trim() === "") {
    document.querySelector(".password-validation").innerHTML =
      "Please enter password !";
    document.getElementById("password").style.borderColor = "red";
    return;
  }
});

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const subBtn = loginForm.getElementsByTagName("button")[0];
  subBtn.disabled = true;
  const spinner = document.getElementById("spinner");
  spinner.style.display = "block";

  const password = document.getElementById("password").value;
  const email = document.getElementById("username").value;
  await fetch("https://quiz.1kb.uz/api/Auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      subBtn.disabled = false;
      spinner.style.display = "none";
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "index.html";
    })
    .catch((e) => {
      subBtn.disabled = false;
      spinner.style.display = "none";
      showToast("Login failed! Incorrect email or password!", "failed");
    });

});

const checkbox = document.getElementById("show-password");
checkbox.addEventListener("change", () => {
  password.getAttribute("type") === "text"
    ? password.setAttribute("type", "password")
    : password.setAttribute("type", "text");
});

function showToast(message, status) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  if (status === "failed") {
    toast.classList.add("failed");
  }
  if (status === "success") {
    toast.classList.add("success");
  }
  toast.innerText = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
