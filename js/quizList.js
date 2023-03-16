function handleHashChange() {
  const quizId = location.hash.slice(1);
  fetchQuizData(quizId).then((data) => displayQuiz(data));
}
window.addEventListener("hashchange", handleHashChange);
handleHashChange();

async function fetchQuizData(quizId) {
  let user = JSON.parse(localStorage.getItem("user"));
  const apiUrl = `https://quiz.1kb.uz/api/Quiz/${quizId}`;
  let token = user.Token;
  const loader_conatiner = document.querySelector(".loader-conatiner");
  const quiz_page = document.querySelector(".quiz-page");
  quiz_page.style.display = "none";
  loader_conatiner.style.display = "flex";
  return await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}
function displayQuiz(data) {
  const loader_conatiner = document.querySelector(".loader-conatiner");
  const quiz_page = document.querySelector(".quiz-page");
  const quizzes_list = document.querySelector(".quizzes-list");
  const btn = document.createElement("button");
  let user = JSON.parse(localStorage.getItem("user"));
  let token = user.Token;
  btn.classList.add("quiz-submit-btn");
  btn.textContent = "End quiz";
  btn.addEventListener("click", async () => {
    btn.setAttribute("disabled", "true");
    const queryString = new URLSearchParams({
      UserId: user.UserId,
      QuizId: data.Id,
    }).toString();
    const response = await fetch(
      `https://quiz.1kb.uz/api/Results?` + queryString,
      {
        method: "POST",
        body: JSON.stringify(questionsAnswer),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      btn.setAttribute("disabled", "false");
      const quiz_result = document.getElementById("quiz-results");
      quiz_result.style.display = "block";
      const responseData = await response.json();
      resultPage(data, questionsAnswer);
      resultModal(responseData, data);
    } else btn.setAttribute("disabled", "false");
  });
  quiz_page.style.display = "block";
  loader_conatiner.style.display = "none";
  const title = document.querySelector(".quiz-title");
  title.textContent = data?.Title;
  const questions = data?.Questions;
  let questionsAnswer = [];
  const handleChangeAsnwer = (element) => {
    const sortAnswer = questionsAnswer.find(
      (item) => item.questionId === element.QuestionId
    );
    let changedAnswer = {
      questionId: element.QuestionId,
      optionId: element.Id,
    };
    if (sortAnswer) {
      const sortedQuestionsAnswer = questionsAnswer.map((item) =>
        item.questionId === element.QuestionId ? changedAnswer : item
      );
      questionsAnswer = [...sortedQuestionsAnswer];
    } else
      questionsAnswer.push({
        questionId: element.QuestionId,
        optionId: element.Id,
      });
  };
  questions?.forEach((item) => {
    console.log(item);
    const h2 = document.createElement("h2");
    const div = document.createElement("div");
    const ul = document.createElement("ul");
    div.classList.add("quiz-card");
    h2.classList.add("quiz-text");
    h2.innerHTML = `${item.Id}. ${item.Text}`;
    ul.classList.add("question_options");
    div.appendChild(h2);
    div.appendChild(ul);
    quizzes_list.appendChild(div);
    quizzes_list.appendChild(btn);
    item.Options.forEach((element) => {
      const li = document.createElement("li");
      li.classList.add("options");
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.addEventListener("change", () => handleChangeAsnwer(element));
      label.setAttribute("for", `${element.Id}`);
      input.setAttribute("type", "radio");
      input.setAttribute("name", `${element.QuestionId}`);
      input.setAttribute("value", `${element.IsCorrect}`);
      input.setAttribute("id", `${element.Id}`);
      label.textContent = `${element.Text}`;
      li.appendChild(input);
      li.appendChild(label);
      ul.appendChild(li);
    });
  });
}
const resultModal = (responseData, data) => {
  const quiz_result = document.querySelector(".result-container");
  const table = document.createElement("table");
  const title = document.createElement("h1");
  title.innerHTML = "Quiz results";
  table.classList.add("result-table");
  const nameRow = table.insertRow();
  const nameHeader = nameRow.insertCell();
  const nameTitle = nameRow.insertCell();
  nameHeader.textContent = "Student: ";
  nameTitle.textContent = JSON.parse(localStorage.getItem("user")).FullName;
  const quiz = table.insertRow();
  const quizHeader = quiz.insertCell();
  const quizTitle = quiz.insertCell();
  quizHeader.textContent = "Subject: ";
  quizTitle.textContent = data.Title;

  const numberQuestions = table.insertRow();
  const numberHeader = numberQuestions.insertCell();
  const numberTitle = numberQuestions.insertCell();
  numberHeader.textContent = "Questions: ";
  numberTitle.textContent = data.Questions.length;

  const score = table.insertRow();
  const scoreHeader = score.insertCell();
  const scoreTitle = score.insertCell();
  scoreHeader.textContent = "Score: ";
  scoreTitle.textContent = responseData.score;

  const percentage = table.insertRow();
  const percentageHeader = percentage.insertCell();
  const percentageTitle = percentage.insertCell();
  percentageHeader.textContent = "Result: ";
  percentageTitle.textContent = `${
    (responseData.score / data.Questions.length) * 100
  }/100%`;

  const btn_container = document.createElement("div");
  btn_container.classList.add("result_btns");
  const btn = document.createElement("div");
  const show_results = document.createElement("div");
  show_results.classList.add("show_results");
  show_results.innerHTML = "Show results";
  show_results.addEventListener("click", () => {
    const quiz_result = document.getElementById("quiz-results");
    quiz_result.style.display = "none";
  });
  btn_container.appendChild(show_results);
  btn_container.appendChild(btn);
  btn.classList.add("go-back");
  btn.innerHTML = "< Return to task list";
  btn.addEventListener("click", () => (window.location.href = "index.html"));
  quiz_result.appendChild(title);
  quiz_result.appendChild(table);
  quiz_result.appendChild(btn_container);
};
const resultPage = (data, questionsAnswer) => {
  const quizzes_list = document.querySelector(".quizzes-list");
  quizzes_list.innerHTML = "";
  const title = document.querySelector(".quiz-title");
  title.textContent = data?.Title;
  const questions = data?.Questions;
  questions?.forEach((item) => {
    const findAnswer = questionsAnswer.find((i) => i.questionId === item.Id);
    const h2 = document.createElement("h2");
    const div = document.createElement("div");
    const ul = document.createElement("ul");
    div.classList.add("quiz-card");
    h2.classList.add("quiz-text");
    !findAnswer ? h2.classList.add("wrong_value") : null;
    h2.innerHTML = `${item.Id}. ${item.Text}`;
    ul.classList.add("question_options");
    div.appendChild(h2);
    div.appendChild(ul);
    quizzes_list.appendChild(div);
    item.Options.forEach((element) => {
      const li = document.createElement("li");
      li.classList.add("options");
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.addEventListener("change", () => handleChangeAsnwer(element));
      label.setAttribute("for", `${element.Id}`);
      input.setAttribute("type", "radio");
      input.setAttribute("name", `${element.QuestionId}`);
      input.setAttribute("value", `${findAnswer?.optionId}`);
      input.setAttribute("id", `${element.Id}`);

      if (findAnswer?.optionId === element.Id) {
        input.setAttribute("checked", "true");
      }
      if (findAnswer) {
        if (element.IsCorrect) {
          label.classList.add("correct_value");
        } else label.classList.add("wrong_value");
      }
      label.textContent = `${element.Text}`;
      li.appendChild(input);
      li.appendChild(label);
      ul.appendChild(li);
    });
  });
};
