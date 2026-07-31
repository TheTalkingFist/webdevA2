/* jshint esversion: 6 */

const nav = document.querySelector("nav");
const navli = document.querySelector("#navli");
const litem = document.querySelectorAll(".articlebtn");
const burgerbtn = document.querySelector("#burgerbtn");

var menuDisplay = false;

const art1btn = document.querySelector("#article1button");
const art2btn = document.querySelector("#article2button");
const art3btn = document.querySelector("#article3button");

const articles = document.querySelectorAll(".article"); // all pages

const shadingDisplay = document.querySelector("#article2 .text--3img");
const quizbody = document.querySelector("#article2 #quiz-body");
const quizform = document.querySelectorAll(".quiz-fieldset");
const quizbtn = document.querySelector("#quiz-start");
const submitbtn = document.querySelector("#submit");

const scoreh2 = document.querySelector("#score");
const gamebtn = document.querySelector("#gamebtn");
const startbtn = document.querySelector("#startbtn");
const runner = document.querySelector("#runner");

const jumpbtn = document.querySelector("#jumpbtn");
const slidebtn = document.querySelector("#slidebtn");

var jumping = false;
var sliding = false;

const obstacles = document.querySelectorAll(".obstacles");

var spikeinterval;

var isPlaying = false;
var poweredUp = false;

var obsX = [ 100, 100, 100, 100, 100, 100, 100, 100, 100 ];

var score = 0;
var quizqn;

var screenwidth = window.screen.width;

// ===== BGM ===== //

// Synthwave Retro 80s by DELOSound on Pixabay
const bgm = new Audio("audio/DelosoundSynthwaveRetro.mp3");
bgm.loop = true;
bgm.volume = 0.6;

bgm.play();


function hideall()
{
    for (let article of articles)
    {
        article.style.display = "none"; // hides all pages
    }
}

hideall();

// function for showing pages
function showart(artno)
{
    hideall();

    let article = document.querySelector("#article" + artno);

    article.style.display = "block";
}

art1btn.addEventListener("click",
    function()
    {
        showart(1);
    }
);

art2btn.addEventListener("click",
    function()
    {
        showart(2);
    }
);

art3btn.addEventListener("click",
    function()
    {
        showart(3);
    }
);

var chosenqns = [];

// ===== Quiz Section {Article 2} ===== //
function toggleQuiz()
{
    shadingDisplay.style.display = "none";
    quizbody.style.display = "flex";
    quizbtn.style.display = "none";
}

var answer = []; // question for quiz
var quizscore = 0;

function submitQuiz()
{

    var quizans = ["Gradient", "Dithering", "Dithering Gradient"];

    answer[0] = document.querySelector("input[name='q1']:checked").value;
    answer[1] = document.querySelector("input[name='q2']:checked").value;
    answer[2] = document.querySelector("input[name='q3']:checked").value;

    console.log(`Answer = ${quizans}, Player Answer = ${answer}`);
    for (let i = 0; i < quizform.length; i++)
    {
        console.log(answer[i] + quizans[i]);
        if (answer[i] == quizans[i])
        {
            quizscore += 1;
        }
    }

    quizbody.innerHTML += "<p>You got: " + quizscore + " / 3!";
}

quizbtn.addEventListener("click",
    function()
    {
        toggleQuiz();
    }
);

submitbtn.addEventListener("click",
    function()
    {
        submitQuiz();
    }
);

// Minigame
gamebtn.addEventListener("click",
    function()
    {
        showart(4);
    }
);

function land()
{
    setTimeout(function() {
        runner.style.animation = "running-man 600ms steps(6) infinite";
    }, 700);
}

function jump()
{
    jumping = true;
    console.log("hop, step, jump");
    runner.style.animation = "jumping-man 600ms steps(6)";
    setTimeout(function()
    {
        jumping = false;
    }, 700);

    land();
}

function slide()
{
    sliding = true;
    console.log("seppi-ku");
    runner.style.animation = "sliding-man 600ms steps(6)";
    setTimeout(function()
    {
        sliding = false;
    }, 600);

    land();
}

document.addEventListener('keydown', function(kbEvt) {

    if (sliding == false && jumping == false)
    {
        if (kbEvt.code === 'KeyW')
        {
            jump();
        }

        if (kbEvt.code === 'KeyS')
        {
            slide();
        }
    }
});

var chosenObs;
var lastchosen;

function spawnObs()
{
    var speed = [1, 1, 1, 1, 1, 1, 1, 1, 1];

    var posY = 0;
    var chosenObs;
    var obstype;

    let minRunnerPos = 12;
    let maxRunnerPos = 20;

    if (screenwidth < 800)
        {
            var speed = [3, 3, 3, 3, 3, 3, 3, 3, 3];
            let maxRunnerPos = 50;
        }

    chosenObs = (Math.floor(Math.random() * 8) + 1);

    while (chosenObs == lastchosen)
    {
        chosenObs = (Math.floor(Math.random() * 8) + 1);
    }

    lastchosen = chosenObs;

    if (chosenObs < 5)
    {
        obstype = 1;
    }
    else if (chosenObs >= 5)
    {
        obstype = 0;
    }

    console.log("chosenObs = " + chosenObs);


    // Rian helped me with this, was previously using CSS animations to move projectiles.
    let movement = setInterval(function() {
        switch(obstype)
            {
            case 0:
                posY = ((chosenObs - 5) * 20) + 20;
                obstacles[chosenObs].style.bottom = posY + "px";

                obsX[chosenObs] -= speed[chosenObs];
                obstacles[chosenObs].style.left = obsX[chosenObs] + "%";

                if (obsX[chosenObs] > minRunnerPos && obsX[chosenObs] < maxRunnerPos && jumping == false)
                {
                    if (poweredUp == true)
                    {
                        if (sliding == true)
                        {
                            scoreUp(2);
                        }
                        else
                        {
                            scoreUp(1);
                        }
                    }
                    else
                    {
                        die();
                        console.log(obsX[chosenObs]);
                        clearInterval(movement);
                    }
                }
                else if (obsX[chosenObs] == 19)
                {
                    scoreUp(1);
                }

                if (obsX[chosenObs] < -5)
                {
                    speed[chosenObs] = 0;
                    obsX[chosenObs] = 100;
                    obstacles[chosenObs].style.left = obsX[chosenObs] + "%";
                }

                break;

            case 1:
                posY = (100 - (chosenObs * 20));
                obstacles[chosenObs].style.top = posY + "px";

                obsX[chosenObs] -= speed[chosenObs];
                obstacles[chosenObs].style.left = obsX[chosenObs] + "%";

                if (obsX[chosenObs] < -10)
                {
                    speed[chosenObs] = 0;
                    obsX[chosenObs] = 100;
                    obstacles[chosenObs].style.left = obsX[chosenObs] + "%";
                }

                if (obsX[chosenObs] > minRunnerPos && obsX[chosenObs] < maxRunnerPos && sliding == false)
                {
                    if (obstacles[chosenObs].id == "powerup")
                    {
                        console.log("I'm fired up!");
                        speed[chosenObs] = 0;
                        obsX[chosenObs] = 100;
                        obstacles[chosenObs].style.left = obsX[chosenObs] + "%";
                        poweredUp = true;
                        runner.style.filter = "brightness(300%)"; // W3Schools, learnt filter in css
                        setTimeout(function() {
                            runner.style.filter = "brightness(100%)";
                            poweredUp = false;
                            console.log("powered down!");
                        }, 7000);
                    }
                    else
                    {
                        if (poweredUp == true)
                        {

                            if (sliding == true)
                            {
                                console.log("is this thing working?????????")
                                scoreUp(2);
                            }
                            else
                            {
                                scoreUp(1);
                            }
                        }
                        else
                        {
                            die();
                            console.log(obsX[chosenObs]);
                            clearInterval(movement);
                        }
                    }
                }
                else if (obsX[chosenObs] == 19)
                {
                    scoreUp(1);
                    scoreh2.innerHTML = "<h2 id='score'>Score: " + score + "<h2>"
                }
                break;
            }
    }, 20);

    if (obsX[chosenObs] < 0)
    {
        clearInterval(movement);
        obsX[chosenObs] = 100;
        speed[chosenObs] = 0;
    }
    console.log(score);
}

function scoreUp(scoreinc)
{
    score += scoreinc;
    scoreh2.innerHTML = "<h2 id='score'>Score: " + score + "<h2>"
}

function startgame()
{
    startbtn.style.display = "none";

    isPlaying = true;

    spikeinterval = setInterval(function() {

        spawnObs();

        // spawnObs(5);
    }, 1200);

}

function die()
{
    isPlaying = false;
    runner.style.animation = "none";
    clearInterval(spikeinterval);

    for (let x = 0; x < obstacles.length; x++)
    {
        obstacles[x].style.left = "100%";
        obstacles[x].style.display = "none";
    }

    scoreh2.innerHTML = "<h2>You died! Score: " + score + "<h2>";
}

startbtn.addEventListener("click", function()
{
    startgame();
});

jumpbtn.addEventListener("click", function()
{
    jump();
});

slidebtn.addEventListener("click", function()
{
    slide();
});

// ===== Responsive Web Design ===== //
function showmenu()
{
    console.log(menuDisplay);
    if (menuDisplay == true)
    {
        nav.style.display = "none";
        menuDisplay = false;
    }
    else
    {
        menuDisplay = true;
        nav.style.display = "flex";
    }
}

burgerbtn.addEventListener("click", function()
{
    showmenu();
    console.log("hello world");
});
