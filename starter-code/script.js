import data from "./data.json" with { type: "json" }
const themeSwitcher = document.querySelector("#theme_switcher button");
const main = document.querySelector('main')
const questionSide = document.querySelector('main>div')
const answereSide = document.querySelector('aside')
const quizSpec = document.getElementById('quiz_spec')
var numberQuestion = 0
const letterChoice = ['A', 'B', 'C','D','E','F','G']
let answereChoosed = null
let currentQuiz = null
let answereSubmited = false
let score = 0
let errorMessage = null
 
const quizButton = {
  html: document.getElementById("html"),
  css: document.getElementById("css"),
  js: document.getElementById("js"),
  accessibility: document.getElementById("accessibility"),
};

function updateHeader(imgUrl, text) {
    const imgWrapper = document.createElement('div')
    const img = document.createElement('img')
    img.src = imgUrl

    imgWrapper.classList.add(text.toLowerCase())
    imgWrapper.append(img)
    quizSpec.prepend(imgWrapper)

    quizSpec.querySelector('h3').innerText = text

}

function updateQuestionSide(quiz) {
    questionSide.innerHTML = null
   
    questionSide.classList.add('questions')
    answereSide.classList.add('answere')
    const question = quiz.questions[numberQuestion - 1]
    const numberQuestionElement = document.createElement('p')
    numberQuestionElement.innerText = `
    Question ${numberQuestion} of ${quiz.questions.length}
    ` 
    
    const titleQuestion = document.createElement('h2')
    titleQuestion.innerText=question.question


    questionSide.append(numberQuestionElement)
    questionSide.append(titleQuestion)
}

function createProgressBar(questionLength) {
    const wrapper = document.createElement('div')
    const bar = document.createElement('span')
    bar.style.width = `${numberQuestion / questionLength * 100}%`
    wrapper.classList.add('progress_bar')
    wrapper.append(bar)
    questionSide.append(wrapper)
}

function choiceMissing() {
  if(errorMessage) {
    if(!document.querySelector('p.error_message')) {
      const errorMessage = document.createElement('p')
      errorMessage.innerText = "Please select an answer"
      errorMessage.classList.add('error_message')
      answereSide.append(errorMessage)
    }
  } else {
const errorMessage = document.querySelector('p.error_message')
    answereSide.removeChild(errorMessage)
  }
}

function submitAnswere() {
  const submitButton = document.getElementById('submit_button')
  try {
    answereChoosed.removeAttribute('class')
    answereSubmited = true
    const trueAnswer = currentQuiz.questions[numberQuestion - 1].answer === answereChoosed.querySelector('p').innerText
  if(trueAnswer) {
    answereChoosed.classList.add('valid')
    score ++
  } else {
    answereChoosed.classList.add('invalid')
    const buttons = document.querySelectorAll('aside.answere ul li button');
    buttons.forEach((button) =>  button.querySelector('p').innerText === currentQuiz.questions[numberQuestion - 1].answer ? button.classList.add('answere_valid') : null );

  }
  submitButton.innerHTML = "Next Question"
  submitButton.addEventListener('click', ()=>{
    answereChoosed = null
    answereSubmited = false
    trueAnswer && score--
    numberQuestion += 1 
    errorMessage =null
    updateAnswereSide(currentQuiz)
    updateQuestionSide(currentQuiz)
    selectChoice()
    createProgressBar(currentQuiz.questions.length)
  })

} catch (error) {
  errorMessage = true
  choiceMissing()
}
}
function selectChoice() {
    const buttons = document.querySelectorAll('aside.answere ul li button');
    let previouslySelected = null; 
      buttons.forEach((button) => { 
        button.addEventListener('click', (e) => {
          document.querySelector('p.error_message') &&( errorMessage = false,choiceMissing())
          
          if(answereSubmited) return
          
          if (previouslySelected) {
          previouslySelected.classList.remove('selected');
        }
        e.currentTarget.classList.add('selected');
        previouslySelected = e.currentTarget;
        answereChoosed = previouslySelected
      });
    });
}

function finalCase() {
  main.removeAttribute('class')
  main.classList.add('result')
  const wrapper = document.createElement('div')
  wrapper.classList.add('final_case')
  questionSide.innerHTML = '<h1>Quiz completed</br><strong>Your scored...</strong></h>'
  const resultCase = `
  <div>
  <div class="${currentQuiz.title.toLowerCase()}">
    <img src="${currentQuiz.icon}">
  </div>
    <p>${currentQuiz.title}</p>
  </div>
  <span>${score}</span>
  <p>out of ${currentQuiz.questions.length}</p>
  `
  wrapper.innerHTML = resultCase
  const button = document.createElement('button')
  button.textContent = "Play again"
  button.addEventListener('click', ()=> window.location.reload() )
  
  answereSide.innerHTML = wrapper.outerHTML
  answereSide.append(button)
  
}


function updateAnswereSide(quiz) {
  
  selectChoice()
    answereSide.innerHTML = null
    let answeres = quiz.questions[numberQuestion - 1].options
    const wrapper = document.createElement('ul')
    answeres.map((answere, id)=>{
      const p = document.createElement('p')
      p.textContent = answere
      const li = document.createElement('li')
        let choice =`
        <button>
          <span>${letterChoice[id]}</span>
          <p>${p.innerHTML}</p>     
        </button>
        `
        
        li.innerHTML = choice
        wrapper.innerHTML += li.outerHTML
        answereSide.append(wrapper)
    })
    const submitButton = document.createElement('button')
    submitButton.id = "submit_button"
    if(!answereChoosed) {
      submitButton.innerHTML = 'Submit Answer'
      console.table([
        numberQuestion,
        currentQuiz.questions.length
      ])
      if(numberQuestion === currentQuiz.questions.length) {
        submitButton.addEventListener('click', finalCase)

      } else {

        submitButton.addEventListener('click', submitAnswere)
      }
    }
    answereSide.append(submitButton)
}

function quizStart(quiz) {
  numberQuestion = 1
  currentQuiz = quiz
  main.removeAttribute('class')
  main.classList.add('quiz')
  updateHeader(quiz.icon, quiz.title)
  updateQuestionSide(quiz)
  updateAnswereSide(quiz)
  selectChoice()
  
  
  createProgressBar(quiz.questions.length)
    
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.dataset.theme = "dark";
  } else {
    document.body.dataset.theme = "light";
  }
});

themeSwitcher.addEventListener("click", (e) => {
  document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
});

quizButton.html.addEventListener('click',()=> quizStart(data.quizzes[0]))
quizButton.css.addEventListener('click',()=> quizStart(data.quizzes[1]))
quizButton.js.addEventListener('click',()=> quizStart(data.quizzes[2]))
quizButton.accessibility.addEventListener('click',()=> quizStart(data.quizzes[3]))
