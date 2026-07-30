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
const quizform = document.querySelector("#quiz-fieldset");
const quizbtn = document.querySelector("#quiz-start");
const quizopts = document.querySelectorAll("fieldset input");
const submitbtn = document.querySelector("#submit");

const gamebtn = document.querySelector("#gamebtn");
const startbtn = document.querySelector("#startbtn");
const runner = document.querySelector("#runner");

const jumpbtn = document.querySelector("#jumpbtn");
const slidebtn = document.querySelector("#slidebtn");

var jumping = false;
var sliding = false;

const spikes = document.querySelectorAll(".spikes");
const birds = document.querySelectorAll(".birds");

var spikeinterval;

var isPlaying = false;
var poweredUp = false;

var obsX = [ 100, 100, 100, 100 ];

var score = 0;
var quizqn;

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

// ===== Quiz Section {Article 2} ===== //
function toggleQuiz()
{
    shadingDisplay.style.display = "none";
    quizbody.style.display = "flex";
    quizbtn.style.display = "none";

    quizqn = (Math.floor(Math.random() * 3) + 1);

    quizform.innerHTML += '<div id="shading' + quizqn + '"></div>';

}

var answer; // question for quiz

function submitQuiz()
{
    var quizans;
    switch(quizqn)
    {
        case 1:
            quizans = "Gradient";
            break;

        case 2:
            quizans = "Dithering";
            break;

        case 3:
            quizans = "Dithering Gradient";
            break;
    }

    answer = document.querySelector("input[name='q1']:checked").value;

    console.log(`Answer = ${quizans}, Player Answer = ${answer}`);
    if (answer == quizans)
    {
        quizbody.innerHTML += "<p>Correct! Nice work.</p>";
    }
    else {
        quizbody.innerHTML += "<p>Wrong!</p>";
    }
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
    // if (kbEvt.code === 'Space' && sliding == false && jumping == false)
    // {
    //     jump();
    // }

    // if (kbEvt.code === 'ArrowDown' && sliding == false && jumping == false)
    // {
    //     slide();
    // }

    if (sliding == false && jumping == false)
    {
        if (kbEvt.code === 'Space')
        {
            jump();
        }

        if (kbEvt.code === 'ArrowDown')
        {
            slide();
        }
    }
});

function spawnObs(obstype, obsno)
{
    var speed = [ 1, 1, 1, 1, 1 ];
    var posY = 0;

    console.log("obstype = " + obstype);
    console.log("obsno = " + obsno);

    // Rian helped me with this, was previously using CSS animations to move projectiles.
    let movement = setInterval(function() {
        switch(obstype)
            {
            case 0:
                posY = (obsno * 20) + 20;
                spikes[obsno].style.bottom = posY + "px";

                obsX[obsno] -= speed[obsno];
                spikes[obsno].style.left = obsX[obsno] + "%";

                if (obsX[obsno] < 0)
                {
                    spikes[obsno].style.left = obsX[obsno] + "%";
                }

                if (obsX[obsno] > 12 && obsX[obsno] < 20 && jumping == false)
                {
                    die();
                    clearInterval(movement);
                }
                else if (obsX[obsno])

                break;

            case 1:
                posY = (100 - (obsno * 20));
                birds[obsno].style.top = posY + "px";

                obsX[obsno] -= speed[obsno];
                birds[obsno].style.left = obsX[obsno] + "%";

                if (obsX[obsno] < 0)
                {
                    birds[obsno].style.left = obsX[obsno] + "%";
                }

                if (obsX[obsno] > 12 && obsX[obsno] < 20 && sliding == false)
                {
                    if (birds[obsno].id = "powerup")
                    {
                        console.log("I'm fired up!");
                    }
                    die();
                    clearInterval(movement);
                }

                break;
            }
    }, 20);

    if (obsX[obsno] < 0)
    {
        obsX[obsno] = 100;
        speed[obsno] = 0;
        clearInterval(movement);
    }
}

function startgame()
{
    console.log(window.screen.width)
    startbtn.style.display = "none";

    isPlaying = true;

    var i = 0;

    spikeinterval = setInterval(function() {
        spawnObs(Math.floor(Math.random() * 2), i); // Deciding which obstacle to spawn
        i++;
        if (i == 4)
        {
            i = 0;
        }
    }, 1200);

}

function die()
{
    isPlaying = false;
    runner.style.animation = "none";
    clearInterval(spikeinterval);

    for (x = 0; x < birds.length; x++)
    {
        birds[x].style.display = "none";
    }

    for (x = 0; x < spikes.length; x++)
    {
        spikes[x].style.display = "none";
    }

    const gamewindow = document.querySelector("#game-window");

    gamewindow.innerHTML += "<h2>You died!<h2>";
}

startbtn.addEventListener("click", function()
{
    startgame();
});

jumpbtn.addEventListener("click", function()
{
    jump();
})

slidebtn.addEventListener("click", function()
{
    slide();
})

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
