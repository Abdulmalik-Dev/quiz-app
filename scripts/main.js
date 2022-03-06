// Cash
let container = document.querySelector(".container");
(startBtn = document.querySelector("#startQuiz")),
  (score = document.querySelector("#score")),
  (minutes = document.querySelector("#minutes")),
  (seconds = document.querySelector("#seconds")),
  (questionsArea = document.querySelector("#questions-area")),
  (answersArea = document.querySelector("#answersArea")),
  (buttonsArea = document.querySelector("#buttonsArea")),
  (nextBtn = document.querySelector("#nextBtn")),
  (pervBtn = document.querySelector("#pervBtn"));
// For Questions And Answers
let questions = [],
  arrayOfQuestions = [],
  arrayOfAnswers = [],
  scoereCount = 0,
  theRightAnswer = "",
  success = 0,
  faild = 0;

startBtn.onclick = () => {
  // Remove The Button
  startBtn.remove();

  scoreAction();
  showQuestions();
};
function showQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      questions = JSON.parse(this.responseText);

      allQuestions();
      timeLeftFunc();
    }
  };
  myRequest.open("GET", "scripts/questions.json", true);
  myRequest.send();
}
function allQuestions() {
  // Set Questions
  (arrayOfQuestions = Object.keys(questions)),
    (random = Math.floor(Math.random() * arrayOfQuestions.length)),
    // Set All Answers Of Random Question
    (arrayOfAnswers = questions[arrayOfQuestions[random]]);

  changeAnswersOrder();

  // Set Question
  questionsArea.innerHTML = arrayOfQuestions[random];

  theRightAnswer = questions[questionsArea.innerHTML].right_answer;
}
function changeAnswersOrder() {
  // Get All Answers To Make Change Of It's Order
  let changeOrderOfAnswers = Object.values(arrayOfAnswers),
    // To Push Random Answer To Change The Order
    newAnswersOrder = [];
  // Push Random Answers
  newAnswersOrder.push(
    changeOrderOfAnswers[
      Math.floor(Math.random() * Object.values(arrayOfAnswers).length)
    ]
  );
  // Remove The Random Answer
  changeOrderOfAnswers.splice(
    changeOrderOfAnswers.indexOf(newAnswersOrder[0]),
    1
  );

  // Push All Answers To New Order Array
  changeOrderOfAnswers.forEach((ele) => newAnswersOrder.push(ele));

  // Set All Answers After Change It's Order
  newAnswersOrder.forEach((answer) => {
    let answerContainer = document.createElement("div"),
      theAnswer = document.createTextNode(answer);
    answerContainer.dataset.answer = true;
    answerContainer.appendChild(theAnswer);
    answersArea.appendChild(answerContainer);
  });
}
function timeLeftFunc() {
  let setTimeLeft = setInterval(() => {
    // Check If The Seconds Grater Than 0
    if (seconds.innerHTML > 0) --seconds.innerHTML;
    else {
      // Check If The Minutes Not Equal To 0
      if (minutes.innerHTML != 0) {
        seconds.innerHTML = 59;
        --minutes.innerHTML;
      } else {
        // Else The Minute Equal To 0

        clearInterval(setTimeLeft);
        scoreAction();
        complateQuiz();
      }
    }
  }, 1000);
}

function complateQuiz() {
  // Remove This Question And Add The Next Question
  delete questions[questionsArea.innerHTML];
  // Ckeck If There Are Questions Or Not
  if (Object.keys(questions).length > 0) {
    // Reset The Time Left For Next Question
    minutes.innerHTML = 2;
    seconds.innerHTML = 0;
    questionsArea.innerHTML = "";
    answersArea.innerHTML = "";

    allQuestions();
    timeLeftFunc();
  } else {
    // Else The Questions Finished Appear Result Area
    container.innerHTML = `
    <div class="endQuiz">
    <img src="${
      success > faild ? "images/prize.jpg" : "images/faild.jpg"
    }" alt="" />
    <p id="score">Solved Questions: ${success + faild}</p>
    <p id="success">Success Answers: ${success}</p>
    <p id="faild">Faild Answers: ${faild}</p>
    <button data-clickAble = 'true'>Again</button>
  </div>`;
    container.style.padding = "15px";
  }
}
function scoreAction() {
  scoereCount++;
  score.innerHTML = `Score: ${scoereCount}`;
}
// On Click On The Answers
document.addEventListener("click", (e) => {
  // Check If The Clicked Element Is Answer Or Not
  if (e.target.dataset.answer === "true") {
    // Set Right Ansers And Faild  Answers
    if (e.target.innerHTML === theRightAnswer) success++;
    else faild++;

    complateQuiz();
    scoreAction();
    // If The User Selected The Answer Make Reset To The Time Left
    if (Object.keys(questions).length <= 0) {
      minutes.innerHTML = 0;
      seconds.innerHTML = 0;
    }
  }
  // On Click To The Agin Button In Result Area
  else if (e.target.dataset.clickable) window.location.reload();
  else null;
});
