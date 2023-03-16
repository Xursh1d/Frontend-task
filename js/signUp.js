const registerForm = document.getElementById("register-form");
const registerBtn = document.getElementById("register-btn");

const full_name = document.getElementById("full-name");
const new_email = document.getElementById("new-email");
const new_password = document.getElementById("new-password");

const regex = /^[A-Za-z0-9]+$/;

full_name.addEventListener("input", () => {
  if (full_name.value.trim() === "") {
    document.querySelector(".full-name-validation").innerHTML =
      "Please enter your full name !";
    document.getElementById("full-name").style.borderColor = "red";
    return;
  }
  if (!regex.test(full_name.value)) {
    document.querySelector(".full-name-validation").innerHTML =
      "Username can only contain letters and digits.";
    document.getElementById("full-name").style.borderColor = "red";
    return;
  } 
  else {
    document.querySelector(".full-name-validation").innerHTML = "";
    full_name.style.borderColor = "";
  }
});

new_email.addEventListener("input", () => {
  if (new_email.value.trim() === "") {
    document.querySelector(".new-email-validation").innerHTML =
      "Please enter a  email address !";
    document.getElementById("new-email").style.borderColor = "red";
    return;
  }
  if (
    !new_email.value.includes("@") ||
    new_email.value.indexOf("@") === 0 ||
    new_email.value.indexOf("@") === new_email.value.length - 1
  ) {
    document.querySelector(".new-email-validation").innerHTML =
      "Please enter a valid email address !";
    document.getElementById("new-email").style.borderColor = "red";
    return;
  } else {
    document.querySelector(".new-email-validation").innerHTML = "";
    new_email.style.borderColor = "";
  }
});

const passwordPattern = /^(?=.*[!@#$%^&*])/;
const passwordRegexNumber = /^(?=.*[0-9])/;
const passwordRegexUppercase = /^(?=.*[A-Z])/;

new_password.addEventListener("input", () => {
  if (new_password.value.trim() === "") {
    document.querySelector(".new-password-validation").innerHTML =
      "Please enter a valid password !";
    document.getElementById("new-password").style.borderColor = "red";
    return;
  }
  if (new_password.value.length < 6) {
    document.querySelector(".new-password-validation").innerHTML =
      "Passwords must be at least 6 characters !";
    document.getElementById("new-password").style.borderColor = "red";
    return;
  }
  if (!passwordPattern.test(new_password.value)) {
    document.querySelector(".new-password-validation").innerHTML =
      "Password must have at least one non-alphanumeric character";
    new_password.style.borderColor = "red";
    return;
  }
  if (!passwordRegexNumber.test(new_password.value)) {
    document.querySelector(".new-password-validation").innerHTML =
      " Passwords must have at least one digit ('0'-'9') !  ";
    document.getElementById("new-password").style.borderColor = "red";
    return;
  }
  if (!passwordRegexUppercase.test(new_password.value)) {
    document.querySelector(".new-password-validation").innerHTML =
      "Passwords must have at least one uppercase ('A'-'Z') !  ";
    document.getElementById("new-password").style.borderColor = "red";
    return;
  } else {
    document.querySelector(".new-password-validation").innerHTML = "";
    new_password.style.borderColor = "";
  }
});

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const subBtn = registerForm.getElementsByTagName("button")[0];
  subBtn.disabled = true;
  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("new-email").value;
  const password = document.getElementById("new-password").value;

  const spinner = document.getElementById("register-spinner");
  spinner.style.display = "block";
  await fetch("https://quiz.1kb.uz/api/Auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullName,
      password,
      email,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      subBtn.disabled = false;
      spinner.style.display = "none";
      window.location.href = "logIn.html";
    })
    .catch((e) => {
      subBtn.disabled = false;
      spinner.style.display = "none";
      showToast(e.message, "faild");
      console.log("error", e.message);
    });
});

const checkbox = document.getElementById("show-password");
checkbox.addEventListener("change", () => {
  new_password.getAttribute("type") === "text"
    ? new_password.setAttribute("type", "password")
    : new_password.setAttribute("type", "text");
});

function showToast(message, status) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  status === "success"
    ? toast.classList.add("success")
    : toast.classList.add("failed");
  toast.innerText = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
