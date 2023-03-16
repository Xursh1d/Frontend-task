const loader_conatiner = document.querySelector(".loader-conatiner");
const app_container = document.querySelector(".app");

function handleHashChange() {
  const leaderboard_title = document.querySelector(".leaderboard-title");
  const hash = window.location.hash.substring(1);
  const [quizId, quizTitle] = hash.split("&");
  leaderboard_title.innerHTML = quizTitle.replace("%20", " ");
  fetchQuizData(quizId);
}
window.addEventListener("hashchange", handleHashChange);
handleHashChange();

async function fetchQuizData(quizId) {
  app_container.style.display = "none";
  loader_conatiner.style.display = "flex";
  const apiUrl = `https://quiz.1kb.uz/api/Leaderboards/${quizId}`;
  let user = JSON.parse(localStorage.getItem("user"));
  let token = user.Token;
  return await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((scores) => {
      let leaderboardHtml = "";
      scores.forEach((score, index) => {
        leaderboardHtml += `
                <tr>
                    <td class="rank" data-column="Rank">${index + 1}</td>
                    <td data-column="Name">${score.fullName}</td>
                    <td data-column="Email">${score.email}</td>
                    <td data-column="Score">${score.score}</td>
                </tr>
            `;
      });

      document.getElementById("leaderboard").innerHTML = leaderboardHtml;
      app_container.style.display = "block";
      loader_conatiner.style.display = "none";
    })
    .catch((error) => console.error(error));
}
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
      quizzes.forEach((quiz) => {
        const dropdown_content = document.querySelector(".dropdown-content");
        const p = document.createElement("p");
        p.innerHTML = quiz.title;
        p.addEventListener("click", () => leaderboards(quiz.id, quiz.title));
        dropdown_content.appendChild(p);
      });
      app_container.style.display = "block";
      loader_conatiner.style.display = "none";
    });
  function leaderboards(quizId, quizTitle) {
    const leaderboardUrl = `leaderboard.html#${quizId}&${quizTitle}`;
    location.href = leaderboardUrl;
  }
}
onReLoad();
