const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");



const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

let score = 0;
let success = 0;
let failure = 0;


// score
function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = `Score: ${score}`;
}
updateScore();

// success
function updateSuccessCount() {
  const successElement = document.getElementById("success");
  successElement.innerText = `Success: ${success}`;
}
updateSuccessCount()

//  failure
function updateFailureCount() {
  const failureElement = document.getElementById("failure");
  failureElement.innerText = `Failure: ${failure}`;
}
updateFailureCount()


// inputテキスト入力。合っているかどうかの判定。

typeInput.addEventListener("input", () => {
  // タイピング音を付ける
  typeSound.volume = 0.1;
  typeSound.play();
  typeSound.currentTime = 0;
  const sentenceArray = typeDisplay.querySelectorAll("span");
  // console.log(sentenceArray);
  const arrayValue = typeInput.value.split("");
  // console.log(arrayValue);
  let correct = true;
  sentenceArray.forEach((characterSpan, index) => {
    if ((arrayValue[index] == null)) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;

    } else if (characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
      score++; 
      updateScore();
      success++;
      updateSuccessCount()

    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");

      wrongSound.volume = 0.05;
      wrongSound.play();
      wrongSound.currentTime = 0;
      correct = false;

      score--;
      failure++;
      updateScore(); 
      updateFailureCount();
    }
  });
  if (correct == true) {
    correctSound.volume = 0.5;
    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextSentence();
  }

});




// 非同期でランダムな文章を取得する

function GetRandomSentence() {
  return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then((data) => data.content);
}

// ランダムな文章を取得して、表示する
async function RenderNextSentence() {
  const sentence = await GetRandomSentence();
  // console.log(sentence);
  typeDisplay.innerText = "";
  // 文章を1文字ずつ分解して、spanタグを生成する
  let oneText = sentence.split("");
  oneText.forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;

    typeDisplay.appendChild(characterSpan);
    // console.log(characterSpan);
    // characterSpan.classList.add("correct");
  });

  // テキストボックスの中身を消す
  typeInput.value = "";
  StartTimer()

}

let startTime;
let originTime = 30;
function StartTimer() {
  timer.innerHTML = originTime;
  startTime = new Date();
  // console.log(startTime);
  setInterval(() => {
    timer.innerText = originTime - getTimerTime();
    if (timer.innerText <= 0) TimeUp();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function TimeUp() {
  RenderNextSentence()
}


RenderNextSentence();
