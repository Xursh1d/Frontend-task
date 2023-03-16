function isTokenExpired(ExpiresAt) {
  const expirationTime = Date.parse(ExpiresAt) / 1000;
  const currentTime = Date.now() / 1000;
  return expirationTime < currentTime;
}
const user = JSON.parse(localStorage.getItem("user"));
const ExpiresAt = user?.ExpiresAt;

if (!user) {
  window.location.href = "logIn.html";
}
if (isTokenExpired(ExpiresAt)) {
  localStorage.removeItem("user");
  refreshUser();
  const refreshUser = async () => {
    const body = {
      token: user.Token,
      refreshToken: user.RefreshToken,
    };
    const response = await fetch("https://quiz.1kb.uz/api/Auth/refresh-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      app();
    } else window.location.href = "logIn.html";
  };
} else app();

function app() {
  const quizListElement = document.getElementById("quiz-list");
  async function onReLoad() {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = user.Token;
    const loader_conatiner = document.querySelector(".loader-conatiner");
    const app_container = document.querySelector(".app");
    app_container.style.display = "none";
    loader_conatiner.style.display = "flex";
    await fetch("https://quiz.1kb.uz/api/Quiz", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((quizzes) => {
        app_container.style.display = "block";
        loader_conatiner.style.display = "none";
        quizzes.forEach((quiz) => {
          const dropdown_content = document.querySelector(".dropdown-content");
          const p = document.createElement("p");
          p.innerHTML = quiz.title;
          p.addEventListener("click", () => leaderboards(quiz.id, quiz.title));
          dropdown_content.appendChild(p);

          const quizElement = document.createElement("div");
          quizElement.classList.add("quiz");
          const img = document.createElement("img");
          img.setAttribute("src", "./images/website-content-sections.png");
          img.classList.add("quiz-img");
          const titleElement = document.createElement("h2");
          titleElement.innerText = quiz.title;
          titleElement.classList.add("quiz-title");
          const descriptionElement = document.createElement("p");
          descriptionElement.innerText = quiz.description;
          descriptionElement.classList.add("quiz-desc");
          const startButtonElement = document.createElement("button");
          startButtonElement.innerText = "Start Quiz";
          startButtonElement.classList.add("start-quiz-button");
          startButtonElement.addEventListener("click", () => {
            startQuiz(quiz.id);
          });
          quizElement.appendChild(img);
          quizElement.appendChild(titleElement);
          quizElement.appendChild(descriptionElement);
          quizElement.appendChild(startButtonElement);
          quizListElement.appendChild(quizElement);
        });
      });

    function startQuiz(quizId) {
      const quizUrl = `quizList.html#${quizId}`;
      location.href = quizUrl;
    }
    function leaderboards(quizId, quizTitle) {
      const leaderboardUrl = `leaderboard.html#${quizId}&${quizTitle}`;
      location.href = leaderboardUrl;
    }
  }
  onReLoad();
}
