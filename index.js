const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const gameMessage = document.querySelector(".gameMessage");

let keys = {};
let player = {};

const startGame = () => {
  gameArea.innerHTML = "";
  gameMessage.classList.add("hide");
  startScreen.classList.add("hide");

  player.speed = 3;
  player.score = 0;
  player.inplay = true;

  let bird = document.createElement("div");
  bird.setAttribute("class", "bird");
  let wing = document.createElement("span");
  wing.setAttribute("class", "wing");
  wing.pos = 15;
  wing.style.top = wing.pos + "px";
  bird.appendChild(wing);
  gameArea.appendChild(bird);

  player.x = bird.offsetLeft;
  player.y = bird.offsetTop;
  player.pipe = 0;
  let spacing = 300;
  let howMany = Math.floor((gameArea.offsetWidth) / spacing);

  for (let x = 0; x < howMany; x++) {
      buildPipes(player.pipe * spacing);
  }
  window.requestAnimationFrame(playGame);
}

function buildPipes(startPos) {
    let totalHeight = gameArea.offsetHeight;
    let totalWidth = gameArea.offsetWidth;
    player.pipe++;
    let pipeColor = randomColor();
    let pipeUpper = document.createElement("div");
    pipeUpper.start = startPos + totalWidth;
    pipeUpper.classList.add("pipe");
    pipeUpper.innerHTML = "<br>" + player.pipe;
    pipeUpper.height = Math.floor(Math.random() * 350);
    pipeUpper.style.height = pipeUpper.height + "px";
    pipeUpper.style.left = pipeUpper.start + "px";
    pipeUpper.style.top = "0px";
    pipeUpper.x = pipeUpper.start;
    pipeUpper.id = player.pipe;
    pipeUpper.style.backgroundColor = pipeColor;
    gameArea.appendChild(pipeUpper);
    let pipeSpace = Math.floor(Math.random() * 250) + 150;
    let pipeBottom = document.createElement("div");
    pipeBottom.start = pipeUpper.start;
    pipeBottom.classList.add("pipe");
    pipeBottom.innerHTML = "<br>" + player.pipe;
    pipeBottom.style.height = totalHeight - pipeUpper.height - pipeSpace + "px";
    pipeBottom.style.left = pipeUpper.start + "px";
    pipeBottom.style.bottom = "0px";
    pipeBottom.x = pipeUpper.start;
    pipeBottom.id = player.pipe;
    pipeBottom.style.backgroundColor = pipeColor;
    gameArea.appendChild(pipeBottom);
}

function randomColor() {
    const random = Math.random().toString(16).slice(-4);
    return `#dd${random}`;
}

function movePipes(bird) {
    let obstacles = document.querySelectorAll(".pipe");
    let counter = 0;
    obstacles.forEach(function (obst) {
        obst.x -= player.speed;
        obst.style.left = obst.x + "px";
        if (obst.x < 0) {
            obst.parentElement.removeChild(obst);
            counter++;
        }
        if (doesCollide(obst, bird)) {
            playGameOver(bird);
        }
    })
    counter = counter / 2;
    for (let x = 0; x < counter; x++) {
        buildPipes(0);
    }
}

function doesCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        (aRect.bottom < bRect.top) || (aRect.top > bRect.bottom) || (aRect.right < bRect.left) || (aRect.left > bRect.right))
}

function playGame() {
    if (player.inplay) {
        let bird = document.querySelector(".bird");
        let wing = document.querySelector(".wing");
        movePipes(bird);
        let moveWing = false;
        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed;
            moveWing = true;
        } else if (keys.ArrowRight && player.x < (gameArea.offsetWidth - 50)) {
            player.x += player.speed;
            moveWing = true;
        } else if ((keys.ArrowUp || keys.Space) && player.y > 0) {
            player.y -= (player.speed * 5);
            moveWing = true;
        } else if (keys.ArrowDown && player.y < (gameArea.offsetHeight - 50)) {
            player.y += player.speed;
            moveWing = true;
        }


        if (moveWing) {
            wing.pos = (wing.pos == 15) ? 25 : 15;
            wing.style.top = wing.pos + "px";
        }
        player.y += (player.speed * 2);
        if (player.y > gameArea.offsetHeight) {
            playGameOver(bird);
        }
        bird.style.top = player.y + "px";
        bird.style.left = player.x + "px";
        window.requestAnimationFrame(playGame);
        player.score++;
        score.innerText = "Score: " + player.score;
    }
}

function playGameOver(bird) {
    player.inplay = false;
    gameMessage.classList.remove("hide");
    bird.setAttribute("style", "transform:rotate(180deg)");
    gameMessage.innerHTML = "Game Over<br>You scored " + player.score-- + "<br>Click here to start again";
}

function pressOn(e) {
    e.preventDefault();
    keys[e.code] = true;
}

function pressOff(e) {
    e.preventDefault();
    keys[e.code] = false;
}

gameMessage.addEventListener("click", startGame);
startScreen.addEventListener("click", startGame);
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);