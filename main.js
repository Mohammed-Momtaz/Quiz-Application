let quizCategorySelect = document.querySelector(".quiz-category .select");
let quizCategorySelectI = document.querySelector(".quiz-category .select i");
let quizCategoryP = document.querySelector(".quiz-category p");
let quizCategoryUl = document.querySelector(".quiz-category ul");
let quizCategoryLi = document.querySelectorAll(".quiz-category li");

let numOfQ = 0;
let quizCat = "";

quizCategorySelect.onclick = function () {
    if (quizCategoryUl.style.display === 'block') {
        quizCategoryUl.style.display = 'none';
        quizCategorySelectI.style = "transform: rotate(0deg);transition: 0.6s;"
    } else {
        quizCategoryUl.style.display = 'block';
        quizCategorySelectI.style = "transform: rotate(180deg);transition: 0.6s;"
    };
};

quizCategoryLi.forEach(e => {
    e.onclick = function () {
        let span = document.createElement('span');
        span.innerHTML = e.innerHTML;
        quizCategoryP.innerHTML = "";
        quizCategoryP.appendChild(span);
        quizCategoryUl.style.display = 'none';
        quizCategorySelectI.style = "transform: rotate(0deg);transition: 0.6s;"
        quizCat = span.children[1].innerHTML.toLowerCase();
    };
});

let answersNumberSelect = document.querySelector(".answers-number .select");
let answersNumberSelectI = document.querySelector(".answers-number .select i");
let answersNumberP = document.querySelector(".answers-number p");
let answersNumberUl = document.querySelector(".answers-number ul");
let answersNumberLi = document.querySelectorAll(".answers-number li");

answersNumberSelect.onclick = function () {
    if (answersNumberUl.style.display === 'block') {
        answersNumberUl.style.display = 'none';
        answersNumberSelectI.style = "transform: rotate(0deg);transition: 0.6s;";
    } else {
        answersNumberUl.style.display = 'block';
        answersNumberSelectI.style = "transform: rotate(180deg);transition: 0.6s;";
    };
};

answersNumberLi.forEach(e => {
    e.onclick = function () {
        numOfQ = e.innerHTML;
        let span = document.createElement('span');
        span.innerHTML = e.innerHTML;
        answersNumberP.innerHTML = ""
        answersNumberP.appendChild(span);
        answersNumberUl.style.display = 'none';
        answersNumberSelectI.style = "transform: rotate(0deg);transition: 0.6s;"
    };
});

let quizApp = document.querySelector(".quiz-app");
let startButton = document.querySelector(".quiz-options button");
let spansContainer = document.querySelector(".spans");
let submitButton = document.querySelector(".submit-button");
let quizInfo = document.querySelector(".quiz-info");
let numArray;
let rightAnswers = 0;

startButton.addEventListener('click', function () {
    if (numOfQ > 0 && quizCat !== "") {
        submitButton.style.display = "block";
        spansContainer.innerHTML = "";
        numArray = randomUnique(15, numOfQ);
        getQ();
    } else {
        showPopup();
    };
});

let qNum = 0;

function getQ() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let qObject = JSON.parse(this.responseText);
            addBullets(numOfQ);
            addData(qObject[numArray[qNum]]);
            countdown(5, numOfQ);
            submitButton.addEventListener('click', function() {
                let theRightAnswer = qObject[numArray[qNum]].right_answer;
                checkAnswer(theRightAnswer);
                qNum++;
                if (qNum == numOfQ - 1) submitButton.innerHTML = "End The Quiz";
                if (qNum < numOfQ) {
                    addData(qObject[numArray[qNum]]);
                } else if (qNum == numOfQ) {
                    startButton.setAttribute('disabled', 'true');
                    submitButton.setAttribute('disabled', 'true');
                    showResult();
                }
                clearInterval(countdownInterval);
                countdown(5, numOfQ);
                handleBullets()
            });
        };
    };
    myRequest.open("GET", `${quizCat}_questions.json`);
    myRequest.send();
};

function addData(obj) {
    quizInfo.innerHTML = "";
    let h2 = document.createElement("h2");
    h2.innerHTML = obj["title"];
    let answersDiv = document.createElement("div");
    answersDiv.className = "answers"
    answersDiv.appendChild(h2);
    for (let i = 1; i <= 3; i++) {
        let answerDiv = document.createElement("div");
        answerDiv.className = "answer";
        let input = document.createElement("input");
        if (i === 1) input.checked = true;
        input.id = `answer_${i}`;
        input.type = "radio";
        input.name = "questions";
        input.dataset.answer = obj[`answer_${i}`];
        let label = document.createElement("label");
        label.htmlFor = `answer_${i}`;
        label.innerHTML = obj[`answer_${i}`];
        answerDiv.appendChild(input);
        answerDiv.appendChild(label);
        answersDiv.appendChild(answerDiv);
    };
    quizInfo.appendChild(answersDiv);
};

function checkAnswer(rAnswer) {
    let answers = document.getElementsByName("questions");
    let theChoosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function addBullets(num) {
    for (let i = 1; i <= num; i++) {
        let span = document.createElement("span");
        span.classList.add(`span_${i}`);
        spansContainer.appendChild(span);
        if (i === 1) {
            span.classList.add("active");
        };
    };
};

function showResult() {
    quizApp.classList.add("disabled");
    quizInfo.innerHTML = "";
    let div = document.createElement("div");
    let p = document.createElement("p");
    p.innerHTML = `You Did ${rightAnswers} Questions Right`;
    div.appendChild(p);
    div.className = "result"
    document.body.appendChild(div);
    if (rightAnswers === 0) {
        div.style.backgroundColor = "red";
        p.innerHTML = "You Failed";
    } else if (rightAnswers == numOfQ) {
        p.innerHTML = "Congratulations You Did It Without Any Wrong";
    };
    quizCategorySelect.onclick = function () {
        quizCategoryUl.style.display = 'none';
    };
    answersNumberSelect.onclick = function () {
        answersNumberUl.style.display = 'none';
    };
};

let countdownElement = document.querySelector(".countdown");

function countdown(duration, count) {
    if (qNum < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdownElement.innerHTML = `${minutes}:${seconds}`;
            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (qNum === index) {
            span.className = "active";
        }
    });
}

function showPopup() {
    let div = document.createElement("div");
    let p = document.createElement("p");
    let text = document.createTextNode("Please Select Quiz Info");
    p.appendChild(text);
    div.appendChild(p);
    div.className = "popup";
    div.style.opacity = 0;
    document.body.appendChild(div);
    setTimeout(function () {
        div.style.opacity = 1;
    }, 100);
    setTimeout(function () {
        div.style.opacity = 0;
    }, 1000);
    setTimeout(function () {
        div.remove();
    }, 2000);
};

function randomUnique(range, count) {
    let nums = new Set();
    while (nums.size < count) {
        nums.add(Math.floor(Math.random() * range));
    };
    return [...nums];
};