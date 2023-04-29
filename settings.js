function confirmSettingsAndStartGame(){
    let enemyChickenPath = 'resources/Images/' + $('input[name="enemychicken"]:checked').val() + '.png';
    let spaceshipPath = 'resources/Images/' + $('input[name="herospaceship"]:checked').val() + '.png';
    let shootKey = $('#shootKey').val();
    let gameTimer = $('#gameTimer').val();
    updateImages(spaceshipPath, enemyChickenPath);
    updateShootKey(shootKey);
    updateGameTimer(gameTimer);
    play();
}

function updateImages(spaceshipPath, enemyChickenPath){
    chickenImage.src = enemyChickenPath;
    spaceshipImage.src = spaceshipPath;
}

function updateShootKey(shootKey){
    if(shootKey){
        userShootingKeyChoice = shootKey;
    }
}

function updateGameTimer(gameTimer){
    roundDuration = gameTimer * 60;
}

function play(){
    // show play tab on menu
    if(!($("#gameScreen").is(':visible'))){
        $("#gameScreen").show()
    }
    // if you're currently on the gamepage do nothing
    if(location.href.endsWith( "#gamePage")){
        return;
    }
    showClickedPage("#gamePage");
    startGame();
} 






































