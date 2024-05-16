// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Define your quiz array with questions and answers
var quiz = [
  {
    question:
      "Who is the main protagonist in J.K. Rowling's Harry Potter series?",
    answers: shuffleArray([
      "Harry Potter",
      "Hermione Granger",
      "Ron Weasley",
      "Voldemort",
    ]),
    correctAnswer: "Harry Potter",
  },
  {
    question: "What is the capital city of Spain?",
    answers: shuffleArray(["Madrid", "Barcelona", "Seville", "Valencia"]),
    correctAnswer: "Madrid",
  },
  {
    question:
      "Who painted the Mona Lisa, one of the most famous artworks in the world?",
    answers: shuffleArray([
      "Leonardo da Vinci",
      "Pablo Picasso",
      "Vincent van Gogh",
      "Michelangelo",
    ]),
    correctAnswer: "Leonardo da Vinci",
  },
  {
    question: "Which planet is closest to the Sun in our solar system?",
    answers: shuffleArray(["Mercury", "Venus", "Earth", "Mars"]),
    correctAnswer: "Mercury",
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: shuffleArray([
      "Pacific Ocean",
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
    ]),
    correctAnswer: "Pacific Ocean",
  },
  {
    question: "Who wrote the play 'Romeo and Juliet'?",
    answers: shuffleArray([
      "William Shakespeare",
      "Charles Dickens",
      "Jane Austen",
      "Mark Twain",
    ]),
    correctAnswer: "William Shakespeare",
  },
  {
    question: "What is the chemical symbol for water?",
    answers: shuffleArray(["H2O", "CO2", "NaCl", "O2"]),
    correctAnswer: "H2O",
  },
  {
    question: "Who invented the light bulb?",
    answers: shuffleArray([
      "Thomas Edison",
      "Alexander Graham Bell",
      "Nikola Tesla",
      "Albert Einstein",
    ]),
    correctAnswer: "Thomas Edison",
  },
  {
    question: "What is the currency of Japan?",
    answers: shuffleArray(["Yen", "Euro", "Dollar", "Pound"]),
    correctAnswer: "Yen",
  },
  {
    question: "What is the tallest mammal in the world?",
    answers: shuffleArray(["Giraffe", "Elephant", "Hippo", "Rhino"]),
    correctAnswer: "Giraffe",
  },
];

// Return the quiz array
quiz;

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
// var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
// var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
const speakBtn = document.querySelector("#speakBtn");
const confirmBtn = document.querySelector("#confirmBtn");
const readBtn = document.querySelector("#readBtn");
const nextBtn = document.querySelector("#nextBtn");

const progressInd = document.querySelector(".progressIndicator");
const currentQNr = document.querySelector(".currentQuestionNumber");
const TotalQNr = document.querySelector(".totalQuestionNumber");

const questionContainer = document.querySelector(".question");
const answersContainer = document.querySelectorAll(".answersContainer ul");
let answers = document.querySelectorAll(".answersContainer ul li");

const playerAnswer = document.querySelector(".output .answer");

let questionCounter = 0;

let playerCurrentAnswer;

// ===== BEGIN SETUP ===== //

const synth = window.speechSynthesis;

let utterance = new SpeechSynthesisUtterance("");
utterance.lang = "en-US";

const recognition = new SpeechRecognition();
recognition.lang = "en-US";

synth.onvoiceschanged = () => {
  let voices = synth.getVoices().filter(matchVoiceToLang);
  console.log(voices);
  // utterance.voice = voices[49];
};

function matchVoiceToLang(voice) {
  if (voice.lang == utterance.lang) {
    return true;
  }
  return false;
}

currentQNr.innerText = questionCounter + 1;
TotalQNr.innerHTML = quiz.length;
setProgress();

showQuestion(questionCounter, false);
showAnswers(questionCounter, false);

// ===== END SETUP ===== //

readBtn.addEventListener("click", () => {
  readBtn.disabled = true;
  const answersLength = quiz[questionCounter].answers.length;
  let answerOptions;

  quizSpeak(quiz[questionCounter].question);

  showQuestion(questionCounter, true);

  utterance.rate = 0.9;

  answerOptions = "The options are: ";

  for (let i = 0; i < answersLength; i++) {
    if (i + 1 < answersLength) {
      answerOptions += quiz[questionCounter].answers[i] + ", ";
    } else {
      answerOptions += "and " + quiz[questionCounter].answers[i];
    }
  }

  console.log(answerOptions);

  quizSpeak(answerOptions);

  utterance.onend = function () {
    showAnswers(questionCounter, true);

    utterance.onend = function () {
      readBtn.style.display = "none";
      confirmBtn.style.display = "block";
      speakBtn.style.display = "block";

      utterance.rate = 1;
    };
  };
});

// ===== //

speakBtn.addEventListener("click", () => {
  console.log("start met luisteren");
  recognition.start();

  answers.forEach((answer) => {
    answer.classList.remove("answered");
  });

  speakBtn.disabled = true;
});

recognition.onresult = function (event) {
  console.log(event);
  const transcript = event.results[0][0].transcript;
  playerCurrentAnswer = transcript;

  // document.querySelector("#output").innerHTML += transcript + "<br>";
  console.log(playerCurrentAnswer);
  playerAnswer.innerText = transcript;

  // Iterate through the list of answers
  answers.forEach((answer, index) => {
    // Get the text content of the answer
    const answerText = answer.textContent.trim();

    // Compare the answer with the given answer
    if (answerText.toLowerCase() === playerCurrentAnswer.toLowerCase()) {
      // Change the background color of the corresponding list item to green
      answer.classList.add("answered");
    }
  });

  speakBtn.disabled = false;
  readBtn.disabled = false;
  // questionCounter++;
};

confirmBtn.addEventListener("click", () => {
  console.log(quiz[questionCounter].correctAnswer);

  if (
    playerCurrentAnswer.toLowerCase() ===
    quiz[questionCounter].correctAnswer.toLowerCase()
  ) {
    quizSpeak("Correct!");
  } else {
    quizSpeak(
      "Wrong, the right answer is: " + quiz[questionCounter].correctAnswer
    );

    // Iterate through the list of answers
    answers.forEach((answer, index) => {
      // Get the text content of the answer
      const answerText = answer.textContent.trim();

      if (answerText.toLowerCase() === playerCurrentAnswer.toLowerCase()) {
        answer.classList.remove("answered");
        answer.classList.add("wrong");
      }

      if (answerText === quiz[questionCounter].correctAnswer) {
        // Change the background color of the corresponding list item to green
        answer.classList.add("answered");
      }
    });
  }

  utterance.onend = function () {
    confirmBtn.style.display = "none";
    speakBtn.style.display = "none";
    nextBtn.style.display = "block";
  };
});

nextBtn.addEventListener("click", () => {
  questionCounter++;

  showQuestion(questionCounter, false);
  showAnswers(questionCounter, false);

  playerAnswer.innerText = "...";

  readBtn.style.display = "block";
  nextBtn.style.display = "none";

  // const percentageFinished = ((questionCounter + 1) / quiz.length) * 100;
  // progressInd.style.width = percentageFinished + "%";

  // currentQNr.innerText = questionCounter + 1;

  setProgress();

  speakBtn.disabled = false;
  readBtn.disabled = false;
  readBtn.click();
  // setTimeout(() => {
  // }, 5000);
});

// ===== FUNCTIONS =====

function showAnswers(currentQuestionNr, filled) {
  answersContainer[0].innerHTML = " ";

  for (let i = 0; i < quiz[currentQuestionNr].answers.length; i++) {
    const liEl = document.createElement("li");

    if (filled) {
      liEl.innerText = quiz[currentQuestionNr].answers[i];
    } else {
      liEl.innerText = "?";
    }

    answersContainer[0].appendChild(liEl);
  }

  answers = document.querySelectorAll(".answersContainer ul li");
}

function showQuestion(currentQuestionNr, filled) {
  if (filled) {
    questionContainer.innerText = quiz[currentQuestionNr].question;
  } else {
    questionContainer.innerText = "Press the 'Read Question' button";
  }
}

function quizSpeak(text) {
  utterance.text = text;

  console.log(utterance);

  synth.speak(utterance);
}

function setProgress() {
  const percentageFinished = ((questionCounter + 1) / quiz.length) * 100;
  progressInd.style.width = percentageFinished + "%";

  currentQNr.innerText = questionCounter + 1;

  console.log(percentageFinished + "% finished");
}
