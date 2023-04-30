// *******************************variables***********************************
let backgroundImage = new Image();
backgroundImage.src = 'resources/Images/space.png';

let bulletImage = new Image();
bulletImage.src = 'resources/Images/bullet.png';

let chickenBulletImage = new Image();
chickenBulletImage.src = 'resources/Images/fried_chicken.png';

let heartImage = new Image();
heartImage.src = 'resources/Images/heart.png';

let emptyHeartImage = new Image();
emptyHeartImage.src = 'resources/Images/empty_heart.png';

var chickenGif = new Image();
chickenGif.src = "resources/Images/chickens_won.gif";

let spaceshipImage = new Image();

let chickenImage = new Image();

let canvas;
let ctx;
let chickens;
let spaceship;
let lives;
let bullets;
let gameOver;
let userShootingKeyChoice = ' ';
let lives_counter;
let spaceship_start_x;
let spaceship_start_y;
let chickenGifX;
let chickenGifY;
let removedHeart;
let gameScore;
let chickenRow;
let gameOverText;
let currentTime;
let elapsedTime;
let remainingTime;
let minutes;
let seconds;
let timeText;
let roundDuration;
let roundStartTime;
let gameIsRunning;
let gameInterval;
let accelerationInterval;
let firstListener = true;
let accelerationCount;
let gamesHistory = [];
let currentPlayer = null;



//****************************************Start game************************************* */
function startGame()
{
  if(currentPlayer == null || currentPlayer != currentUser){
    currentPlayer = currentUser;
    gamesHistory = [];
  }

  gameOver = false;
  gameIsRunning = true;
  lives_counter = 3;
  accelerationCount = 0;
  roundStartTime = Date.now();
  gameScore = 0;
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth - 600; 
  canvas.height = window.innerHeight - 225;

  // Bad chicken entities
  const numChickens = 20;
  const chickenWidth = 35;
  const chickenHeight = 35;
  const chickenSpacing = 20;
  const chickenStartY = 50;
  const chickenStartX = (canvas.width - (chickenWidth * 5 + chickenSpacing * 4)) / 2; // Centered horizontally
  const heartStartX = 10;  
  const heartStartY = 20;
  const heartWidth = 40;
  const heartHeight = 40;

  spaceship = {
    x: 0,
    y: 0, // Bottom 40% of screen
    width: 80,
    height: 55,
    image: spaceshipImage,
    speed: 25
  };


  spaceship.x = canvas.width / 2;
  spaceship.y = canvas.height * 0.85; // Bottom 40% of screen
  spaceship_start_x = spaceship.x;
  spaceship_start_y = spaceship.y;
  chickens = []
  bullets = []
  chickenBullets = []
  lives = []

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      chickens.push({
        x: chickenStartX + (chickenWidth + chickenSpacing) * col,
        y: chickenStartY + (chickenHeight + chickenSpacing) * row,
        width: chickenWidth,
        height: chickenHeight,
        image: chickenImage,
        numOfRow: row,
        numOfCol: col,
        speed: 3, // Pixels per frame
        direction: 1 // 1 for right, -1 for left
      });
    }
  }

  for (let i = 0; i < 3; i++) {
    lives.push({
      x: heartStartX + i*40,
      y: heartStartY,
      width: heartWidth,
      height: heartHeight,
      image: heartImage
    })
  }

  if (firstListener){
    firstListener = false;
    addEventListener('keydown', (event) => {
      // Check which arrow key was pressed
      switch (event.key) {
        case 'ArrowUp':
          // Move spaceship up if not already at the top of the screen
          if (spaceship.y > canvas.height * 0.6) {
            spaceship.y -= spaceship.speed;
          }
          break;
        
        case 'ArrowDown':
          // Move spaceship down if not already at the bottom of the screen
          if (spaceship.y < canvas.height - spaceship.height / 2) {
            spaceship.y += spaceship.speed;
          }
          break;
        
        case 'ArrowLeft':
          // Move spaceship left
          if (spaceship.x > spaceship.width / 2) { // check if spaceship is within left boundary
            spaceship.x -= spaceship.speed;
          }
          break;
        
        case 'ArrowRight':
          // Move spaceship right
          if (spaceship.x < canvas.width - spaceship.width / 2) { // check if spaceship is within right boundary
            spaceship.x += spaceship.speed;
          }
          break;
        
        case userShootingKeyChoice:
          // Fire bullet
          bullets.push({
            x: spaceship.x,
            y: spaceship.y,
            width: 50,
            height: 55,
            speed: 7,
            direction: -1 // 1 for up
          });
          const bulletAudio = document.getElementById('bulletSound');
          bulletAudio.currentTime = 0;
          if (gameIsRunning){
            bulletAudio.play();
          }
          break;
        default:
          return;
      }
      // Prevent default key behavior (scrolling)
      event.preventDefault();
    });
  }
  

  playBackgroundMusic();
  backgroundMusicInterval = setInterval(playBackgroundMusic, 10000);
  randomChickenShoot();
  accelerationInterval = setInterval(accelerateElements, 5000);
  gameLoop();

  document.getElementById("new-game-btn").addEventListener(
    "click", function() {
      startNewGame();
    }, false);  


}

function update() {
  // Move chickens
  let reachedWall = false;
  let hitLeftWall = false;
  let hitRightWall = false;
  chickens.forEach((chicken) => {
    chicken.x += chicken.speed * chicken.direction;
    if (chicken.x + chicken.width / 2 > canvas.width) {
      hitRightWall = true;
    } else if (chicken.x - chicken.width / 2 < 0) {
      hitLeftWall = true;
    }
  });

  if (hitLeftWall || hitRightWall) {
    reachedWall = true;
    chickens.forEach((chicken) => {
      chicken.direction *= -1;
    });
  }
  bullets.forEach(bullet => {
  // Move bullets
    bullet.y += bullet.speed * bullet.direction;
  });

  chickenBullets.forEach(bullet => {
    // Move chickens bullets
      bullet.y += bullet.speed * bullet.direction;
    });

  checkCollisions();
  checkBadCollisions();

  if (chickens.length == 0){
    gameIsRunning = false;
    gamesHistory.push(gameScore);
    clearInterval(backgroundMusicInterval);
    clearInterval(accelerationInterval);
    stopBackgroundMusic();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 5;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ff0000";
    ctx.strokeText("Champion!", canvas.width/2, canvas.height/6);
    ctx.fillText("Champion!", canvas.width/2, canvas.height/6);
    window.cancelAnimationFrame(gameInterval);
    ctx.font = "bold 18px Arial";
    ctx.strokeText("Games History:", 80, canvas.height / 6);
    ctx.fillText("Games History:", 80, canvas.height / 6);
    
    // ctx.fillText("Games History:", 10, canvas.height/2);
    // for (let i = 0; i < gamesHistory.length; i++) {
    //   ctx.fillText("Game " + (i+1) + " score: " + gamesHistory[i], 10, canvas.height/2 + (i+1)*50);
    // }

    // // Display games history table
    // ctx.font = "bold 16px Arial";
    // ctx.fillStyle = "#ffffff";
    // ctx.textAlign = "left";
    // ctx.shadowColor = "none";
    // ctx.shadowBlur = 0;

    // // Sort games history by score
    // gamesHistory.sort((a, b) => b - a);

    // // Get the index of the current round
    // let currentRoundIndex = gamesHistory.indexOf(gameScore);

    // // Display table header
    // ctx.strokeStyle = "#000000";
    // ctx.lineWidth = 1;
    // ctx.strokeText("Games History:", 10, canvas.height / 6);
    // ctx.fillStyle = "#ffcc00";
    // ctx.fillRect(10, canvas.height / 6 + 30, 400, 30);
    // ctx.fillStyle = "#000000";
    // ctx.fillText("Game", 15, canvas.height / 6 + 50);
    // ctx.fillText("Score", 215, canvas.height / 6 + 50);

    // // Display table rows
    // for (let i = 0; i < gamesHistory.length; i++) {
    //   if (i === currentRoundIndex) {
    //     ctx.fillStyle = "#ff9933";
    //     ctx.fillRect(10, canvas.height / 6 + 60 + i * 30, 400, 30);
    //     ctx.fillStyle = "#000000";
    //   } 
    //   else {
    //     ctx.fillStyle = "#ffffff";
    //     ctx.strokeStyle = "#000000";
    //     ctx.lineWidth = 1;
    //     ctx.strokeText(i + 1, 15, canvas.height / 6 + 80 + i * 30);
    //     ctx.strokeText(gamesHistory[i], 215, canvas.height / 6 + 80 + i * 30);
    //   }
    //   ctx.fillText(i + 1, 15, canvas.height / 6 + 80 + i * 30);
    //   ctx.fillText(gamesHistory[i], 215, canvas.height / 6 + 80 + i * 30);
    // }

    // Display games history table
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.shadowColor = "none";
    ctx.shadowBlur = 0;

    // Sort games history by score
    gamesHistory.sort((a, b) => b - a);

    // Get the index of the current round
    let currentRoundIndex = gamesHistory.indexOf(gameScore);

    // Display table header
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(10, canvas.height / 6 + 30, 400, 30);
    ctx.fillStyle = "#000000";
    ctx.fillText("Game", 15, canvas.height / 6 + 50);
    ctx.fillText("Score", 215, canvas.height / 6 + 50);

    // Display table rows
    for (let i = 0; i < gamesHistory.length; i++) {
      if (i === currentRoundIndex) {
        ctx.fillStyle = "#ff9933";
        ctx.fillRect(10, canvas.height / 6 + 60 + i * 30, 400, 30);
        ctx.fillStyle = "#000000";
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2; // increase line width for the non-highlighted rows
        ctx.strokeText(i + 1, 15, canvas.height / 6 + 80 + i * 30);
        ctx.strokeText(gamesHistory[i], 215, canvas.height / 6 + 80 + i * 30);
      }
      ctx.fillText(i + 1, 15, canvas.height / 6 + 80 + i * 30);
      ctx.fillText(gamesHistory[i], 215, canvas.height / 6 + 80 + i * 30);
    }
}

  if (lives_counter == 0) {
    gameIsRunning = false;
    gameOver = true;
    gamesHistory.push(gameScore);
    clearInterval(backgroundMusicInterval);
    clearInterval(accelerationInterval);
    stopBackgroundMusic();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 5;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ff0000";
    ctx.strokeText("You Lost", canvas.width/2, canvas.height/6);
    ctx.fillText("You Lost", canvas.width/2, canvas.height/6);
    ctx.strokeText("In this round your score is:" + gameScore, canvas.width/2, canvas.height/4);
    ctx.fillText("In this round your score is:" + gameScore, canvas.width/2, canvas.height/4);
    
    chickenGifX = canvas.width - 315;
    chickenGifY = canvas.height/10 - 110;
    // display the GIF image on the canvas
    chickenGif.onload = function() {
        ctx.drawImage(chickenGif, chickenGifX, chickenGifY);
    };
    chickenGif.src = "resources/Images/chickens_won.gif";
    
    window.cancelAnimationFrame(gameInterval); 

    ctx.fillText("Games History:", canvas.width/2, canvas.height/3);
    for (let i = 0; i < gamesHistory.length; i++) {
      ctx.fillText("Game " + (i+1) + " score: " + gamesHistory[i], canvas.width/2, canvas.height/3 + (i+1)*50);
    }
  }

   currentTime = Date.now();
   elapsedTime = (currentTime - roundStartTime) / 1000;
   remainingTime = roundDuration - elapsedTime;
  
   minutes = Math.floor(remainingTime / 60);
   seconds = Math.floor(remainingTime % 60);
   timeText = `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;

  if (roundDuration - elapsedTime <= 0){
    if (gameScore < 100){
      gameOverText = "You can do better";
    }
    else{
      gameOverText = "Winner!";
    }
    gameIsRunning = false;
    gamesHistory.push(gameScore);
    clearInterval(backgroundMusicInterval);
    clearInterval(accelerationInterval);
    stopBackgroundMusic();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 5;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ff0000";
    ctx.strokeText(gameOverText, canvas.width/2, canvas.height/6);
    ctx.fillText(gameOverText, canvas.width/2, canvas.height/6);
    ctx.strokeText("In this round your score is: " + gameScore, canvas.width/2, canvas.height/4);
    ctx.fillText("In this round your score is: " + gameScore, canvas.width/2, canvas.height/4);
    window.cancelAnimationFrame(gameInterval);

    ctx.fillText("Games History:", canvas.width/2, canvas.height/3);
    for (let i = 0; i < gamesHistory.length; i++) {
      ctx.fillText("Game " + (i+1) + " score: " + gamesHistory[i], canvas.width/2, canvas.height/3 + (i+1)*50);
    }
  }



}



function playBackgroundMusic() {
  const backgroundAudio = document.getElementById('background_game_mode_music');
  backgroundAudio.currentTime = 0;
  backgroundAudio.play();


  const backgroundChickenAudio = document.getElementById('background_chicken_music');
  backgroundChickenAudio.currentTime = 0; // restart audio from beginning
  backgroundChickenAudio.play();
  setTimeout(function() {
    backgroundChickenAudio.pause(); // pause the audio after 1 seconds
  }, 1000);
}


function stopBackgroundMusic() {
  const mainBackgroundAudio = document.getElementById('background_game_mode_music');
  mainBackgroundAudio.pause();
}


function accelerateElements() {
  // Increase acceleration count
  accelerationCount++;

  // Increase speed of chickens and their shots
  chickenBullets.forEach(bullet => {
    bullet.speed = bullet.speed * 1.5;
  });

  chickens.forEach(chicken => {
    chicken.speed = chicken.speed * 1.35;
  });

  // Increase speed of spaceship
  spaceship.speed = spaceship.speed * 1.1;

  // If acceleration count reaches 4, clear interval
  if (accelerationCount == 4) {
    clearInterval(accelerationInterval);
  }
}


function checkCollisions(){
  chickens.forEach((chicken,i) => {
    bullets.forEach((bullet,j) => {
      if(bullet.y - bullet.width <= chicken.y + chicken.height && 
        bullet.x + bullet.width >= chicken.x && 
        bullet.x - bullet.width <= chicken.x &&
        bullet.y + bullet.width >= chicken.y){
          chickenRow = chickens[i].numOfRow;
          chickens.splice(i,1);
          bullets.splice(j,1);
          if(chickenRow == 3){
            gameScore = gameScore + 5;
          }
          else if(chickenRow == 2){
            gameScore = gameScore + 10;
          }
          else if(chickenRow == 1){
            gameScore = gameScore + 15;
          }
          else{
            gameScore = gameScore + 20;
          }
          const targetAudio = document.getElementById('target_hit');
          targetAudio.currentTime = 0;
          targetAudio.play();
      }
    })
  })
}



function checkBadCollisions(){
  chickenBullets.forEach((chickenBullet) => {
    // Check if chicken bullet hits the bottom of the screen
    if (chickenBullet.y > canvas.height) {
      // Remove chicken bullet from array
      chickenBullets.splice(chickenBullets.indexOf(chickenBullet), 1);
    }

    // Check if chicken bullet hits the spaceship
    if (chickenBullet.y + chickenBullet.height > spaceship.y &&
        chickenBullet.x > spaceship.x - spaceship.width / 2 &&
        chickenBullet.x < spaceship.x + spaceship.width / 2) {
      // Remove chicken bullet from array
      chickenBullets.splice(chickenBullets.indexOf(chickenBullet), 1);
      // Remove a life from the spaceship's life array
      lives.pop();
      lives_counter = lives_counter - 1;
      spaceship.x = spaceship_start_x;
      spaceship.y = spaceship_start_y;
      
      const spaceshipHitAudio = document.getElementById('spaceship_hit');
      spaceshipHitAudio.currentTime = 0;
      spaceshipHitAudio.play();
    }
  });
}


function randomChickenShoot(){
  setInterval(function() {
    if (gameOver) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * chickens.length);
    const randomChicken = chickens[randomIndex];
    const newChickenBullet = {
      x: randomChicken.x + randomChicken.width / 2,
      y: randomChicken.y + randomChicken.height,
      speed: 5,
      width: 20,
      height: 20,
      direction: 1
    };
    if(chickenBullets.length == 0){
      chickenBullets.push(newChickenBullet);
      const chickenBulletAudio = document.getElementById('chickenLaserSound');
      chickenBulletAudio.currentTime = 0;
      chickenBulletAudio.play();
    }
    else if (chickenBullets.length > 0 && chickenBullets[chickenBullets.length - 1].height >= 0.75 * canvas.height){
      chickenBullets.push(newChickenBullet);
      const chickenBulletAudio = document.getElementById('chickenLaserSound');
      chickenBulletAudio.currentTime = 0;
      chickenBulletAudio.play();  
    }
  }, 250);
}


// Game loop
function gameLoop() {
  draw();
  update();
  if (gameIsRunning){
    gameInterval = requestAnimationFrame(gameLoop);
  }
  checkInterval();
  
  
}
function checkInterval(){
  // let interval = requestAnimationFrame(gameLoop);
  if(document.getElementById("gamePage").style.display == "none"){
    gameIsRunning = false;
    window.cancelAnimationFrame(gameInterval);
    clearInterval(backgroundMusicInterval);
    clearInterval(accelerationInterval);
    stopBackgroundMusic();
    return;
  }
}

function startNewGame(){
  gameIsRunning = false;
  window.cancelAnimationFrame(gameInterval);
  clearInterval(backgroundMusicInterval);
  clearInterval(accelerationInterval);
  stopBackgroundMusic();
  startGame();
}
  

// Draw function
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background
    ctx.drawImage(backgroundImage,0,0, canvas.width, canvas.height);   
  
  
  // Draw spaceship
    ctx.drawImage(spaceshipImage, spaceship.x - spaceship.width / 2, spaceship.y - spaceship.height / 2, spaceship.width, spaceship.height);

  
  // Draw chickens
    chickens.forEach(chicken => {
      ctx.drawImage(chicken.image, chicken.x - chicken.width / 2, chicken.y - chicken.height / 2, chicken.width, chicken.height);
    });
  


  // Draw bullets
    bullets.forEach(bullet => {
      // Draw bullet image
      ctx.drawImage(bulletImage, bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height);
    });
  
    lives.forEach(heart => {
      ctx.drawImage(heartImage, heart.x, heart.y, heart.width, heart.height);
    });

    chickenBullets.forEach(bullet => {
      ctx.drawImage(chickenBulletImage, bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height);
    });

    ctx.font = "48px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + gameScore, 10, canvas.height - 30);


    
    
    ctx.font = "24px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(timeText, 10, canvas.height - 85);

}



