var canvas;
var context;
var board;
var score;
var ready;
var interval;
var timeLeft, timeThen, totalTime, timeout;;
var monster;
var pacman;
var monstersArray = [];
var pacmanDirection;
var pacmanFaceShape;
var bonusCreature;
var monstersStartPositions = [];
var lives;
var monstersNum;
var coinsType1, coinsType2 , coinsType3;
var pacmanCoins;
var clockImage, clockCount;
var fruitImage, fruitCount;
var heartImage, bonusHeartCount;
var monsterPicCount, monster1, monster2, monster3, snitch;
var squareImage; //the game borde walls
var coinsNum;
var monsterHutisticCounter;
var audio;
var wallImage, wallArray=[];


window.addEventListener("load", setup, false);

function exitGame(){
    audio.pause();
    window.clearTimeout(timeout);
    window.clearInterval(interval);
}

function setup()
{
    window.clearInterval(interval);
    window.clearTimeout(timeout);

    canvas = document.getElementById("theCanvas");
    context = canvas.getContext("2d");

    //get param from the player
    totalTime = document.getElementById("setupTime").value * 1000;
    coinsNum = document.getElementById("setupBalls").value;
    monstersNum = document.getElementById("setupMonsters").value;

    audio = new Audio('sound/Gimmick! - Aporia.mp3');
    context.strokeStyle = "yellow";

    //set all images to their vairables
    setAllImages()

    monsterPicCount = 0;
    monstersStartPositions = [[0,0],[19,0],[0,9],[19,9]];
    pacmanFaceShape = 0;
    pacmanDirection = 0;
	monstersArray=[];
    //insert monster to the monster array by the user num of monster choice
    for(var i = 0; i < monstersNum; i++)
    {
        monster = createMonster(i);
        monstersArray.push(monster);
    }

    //add event lisiner for starting the game by click on start button
    document.getElementById("startButton").addEventListener("click", newGame, false );

    //add event lisiner for arrows press - prevent Default and determains new acthion 
    keysDown = {};
    addEventListener("keydown", function (e) {
        var k=e.keyCode;
        if([32,37,38,39,40].indexOf(e.keyCode) > -1)
           e.preventDefault();
        resetKeyDown();
        noKeyPress=false;
        if(k==38) { keysDown[38] = true; }
        if(k==37) { keysDown[37] = true; }
        if(k==39) { keysDown[39] = true; }
        if(k==40) { keysDown[40] = true; }
    }, false);
}

function setAllImages(){
    clockImage = new Image();
    clockImage.src = "images/time.png";
    fruitImage = new Image();
    fruitImage.src = "images/Cherry.png";
    heartImage = new Image();
    heartImage.src = "images/heart.png";

    monster2 = new Image();
    monster2.src = "images/monsters/monster3.png";
    monster1 = new Image();
    monster1.src = "images/monsters/monster2.png";  
    monster3 = new Image();
    monster3.src = "images/monsters/monster1.png";   
    snitch = new Image();
    snitch.src = "images/monsters/bonus.png";
    wallImage = new Image();
    wallImage.src = "images/squer.png";
}

function setGameAudio(){
    //set the game sound - start the music for the biginning
    audio.currentTime = 0;
    audio.loop = true;
    audio.play();
}

function createBonus()
{
    bonusCreature = new Object();
    bonusCreature.img = [snitch];
    bonusCreature.lastmove = -1;
}

function newGame()
{
     //set the game start values
    timeLeft = totalTime;
    bonusHeartCount = 0;
    monsterHutisticCounter = 0;
    clockCount = 1;
    fruitCount = 1;

   //change status from hidden to visible
    document.getElementById("firstLife").style.visibility = "visible";
    document.getElementById("secondLastLife").style.visibility = "visible";
    document.getElementById("lastLife").style.visibility = "visible";


    pacman = new Object();
    pacmanCoins = coinsNum;
    createBonus();
    score = 0;
    lives = 3;
    board = [];

    setGameAudio();
    creatBordWalls();
    setCoinsOnGameBord();
    reset(board);
    timeThen = Date.now();
}

function setCoinsOnGameBord(){
    
    //set the num of coins from each coins type 
    coinsType1 = Math.floor( coinsNum * 0.10);
    coinsType2 = Math.floor( coinsNum * 0.30);
    coinsType3 = coinsNum - coinsType2 - coinsType1;

    var counter = 122;

    for (var i = 0; i < 20; i++) {
        board[i] = new Array();
        for (var j = 0; j < 10; j++) {

            if (wallArray[i][j] == true) {
                board[i][j] = 1;
            }
            else { var randomNum = Math.random();
                if(randomNum <= 1.0 * coinsType3 / counter){
                    coinsType3--;
                    board[i][j] = 2;
                }
                else if(randomNum <= 1.0 * (coinsType2 + coinsType3 ) / counter) {
                    coinsType2--;
                    board[i][j] = 3;
                }
                else if (randomNum <= 1.0 * (coinsType1 + coinsType2 + coinsType3) / counter ) {
                    coinsType1--;
                    board[i][j] = 4;
                }
                else if(randomNum < 1.0 * (coinsType1 + coinsType2 + coinsType3 + clockCount) / counter) {
                    clockCount--;
                    board[i][j] = 5;
                }
                else if(randomNum < 1.0 * (coinsType1 + coinsType2 + coinsType3 + clockCount + fruitCount) / counter) {
                    fruitCount--;
                    board[i][j] = 6;
                }
                else {  board[i][j] = 0; }
                counter--;
            }
        }
    }

    //set the position of all the coins we didnt put on the board by the random function 
    while(coinsType1 > 0 || coinsType2 > 0 || coinsType3 > 0 || clockCount > 0 || fruitCount > 0) {
        var emptyCell = getEmptyCell(board);
        if (coinsType3 > 0) {
            board[emptyCell[0]][emptyCell[1]] = 2;
            coinsType3--;
        }
        else if (coinsType2 > 0) {
            board[emptyCell[0]][emptyCell[1]] = 3;
            coinsType2--;
        }
        else if (coinsType1 > 0) {
            board[emptyCell[0]][emptyCell[1]] = 4;
            coinsType1--;
        }
        else if (clockCount > 0) {
            board[emptyCell[0]][emptyCell[1]] = 5;
            clockCount--;
        }
        else if (fruitCount > 0) {
            board[emptyCell[0]][emptyCell[1]] = 6;
            fruitCount--;
        }
    }
}

function resetKeyDown(){
    keysDown[38]=false;
    keysDown[37]=false;
    keysDown[39]=false;
    keysDown[40]=false;
}

function setHartPosition(){

    if(bonusHeartCount > 0) {
        var heartPosition = getEmptyCell(board);
        board[heartPosition[0]][heartPosition[1]] = 7;
        bonusHeartCount = -1;
    }
}

function setMonstersPosition(){
    var monsterTurnPosition = [];
    //put each monster in her difultive start positin (the bord corners)
    for(var i = 0; i < monstersStartPositions.length; i ++)
    {
        monsterTurnPosition[i] = monstersStartPositions[i];
    }

    //set the monster positin fileds (x,y) by the monster position on the bord
    for(var i = 0; i < monstersNum; i++) {

        var indexOfPosition = Math.floor(Math.random() * monsterTurnPosition.length);
        var monsterRandomPosition = monsterTurnPosition[indexOfPosition];
        monstersArray[i].x = monsterRandomPosition[0] * 40;
        monstersArray[i].y = monsterRandomPosition[1] * 40;
        if(indexOfPosition > -1)
            monsterTurnPosition.splice(indexOfPosition, 1);

    }
    if(bonusCreature != null) {
        var bonusCreaturePositionTurn = monsterTurnPosition[0];
        bonusCreature.x = bonusCreaturePositionTurn[0] * 40;
        bonusCreature.y = bonusCreaturePositionTurn[1] * 40;
    }
}

function setPacmanPosition(){
    var pacmanPosition = getEmptyCell(board);
    pacman.x = pacmanPosition[0] * 40;
    pacman.y = pacmanPosition[1] * 40;
}

function reset(board)
{
    pacmanDirection = 0;

    resetKeyDown();
    setHartPosition();
    setMonstersPosition();
    setPacmanPosition();

    noKeyPress=true;

    window.clearInterval(interval);
    window.clearTimeout(timeout);

    ready = false;
    Draw();
    timeout = setTimeout(function(){interval=setInterval(UpdatePosition, 30); }, 2000);

}

function GetKeyPressed() {
    if (keysDown[38])  return 1;//up          
    if (keysDown[40])  return 2;//down          
    if (keysDown[37])  return 3;//left           
    if (keysDown[39])  return 4;//right           
}

function getEmptyCell(board){
    //chose random i,j
    var i = Math.floor((Math.random() * 19) + 1);
    var j = Math.floor((Math.random() * 9) + 1);

    //check if board[i][j] represent empty cell, if not chse another i,j by random function
    while(board[i][j]!=0)
    {
        i = Math.floor((Math.random() * 19) + 1);
        j = Math.floor((Math.random() * 9) + 1);
    }
    return [i,j];             
 }

 function drewPacman(){
    var centerPacmanX = pacman.x + 20;
    var centerPacmanY = pacman.y + 20;

    if(pacmanDirection == 0 || pacmanDirection == 1 || pacmanDirection == 2 || pacmanDirection == 3 || pacmanDirection == 4 || noKeyPress)
    {
        //set the pacman possition
        var pacStart,pacEnd,eyeX,eyeY,bool;
        if(pacmanDirection == 4 || noKeyPress || pacmanDirection == 0)
        {
            pacStart = 0.15, pacEnd = 1.85, eyeX = 5, eyeY = -11;
        }
        else if(pacmanDirection == 1)
        {
            pacStart = 1.35, pacEnd = 1.65, eyeX = -11, eyeY = -5, bool = true;
        }
        else if(pacmanDirection == 2)
        {
            pacStart = 0.65, pacEnd = 0.35, eyeX = 11, eyeY = -5;
        }
        else if(pacmanDirection == 3)
        {
            pacStart = 0.85, pacEnd = 1.15, eyeX = -5, eyeY = -11, bool =true;
        }
        if(pacmanFaceShape == 3)
        {
            pacStart = 0; pacEnd = 8;
        }
    }

    context.beginPath();
    context.arc(centerPacmanX, centerPacmanY, 17, pacStart * Math.PI, pacEnd * Math.PI, bool); // half circle
    context.lineTo(centerPacmanX, centerPacmanY);
    context.fillStyle = "yellow"; //color
    context.fill();
    context.beginPath();
    context.arc(centerPacmanX + eyeX, centerPacmanY + eyeY, 2.5, 0, 2 * Math.PI); // circle
    context.fillStyle = "black"; //color
    context.fill();
 }

 //draw on the board fitcher like- coins, fruit, clock and hearts
 function drawFitcherOnBord(){

    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 40 + 20;
            center.y = j * 40 + 20;

            //drew wall on the board
            if (board[i][j] == 1) {
                context.beginPath();
                context.rect(center.x-20, center.y-20, 40, 40);
                context.drawImage(wallImage,i*40, j*40, 40,40);
            }
            //drew 5 points coin on the board
            else if(board[i][j] == 2)
            {
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI, true); 
                context.fillStyle = "#E2FFC6" ; 
                context.fill();
                context.lineWidth = 2;
                context.strokeStyle = "#66CC01";
                context.stroke();
                context.fillStyle = "black";
                context.fillText("5", center.x - 3, center.y + 4);
            }
            //drew 10 points coin on the board
            else if(board[i][j] == 3)
            {
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
                context.fillStyle = "#ff8782" ; // coin color
                context.fill();
                context.lineWidth = 2;
                context.strokeStyle = "#FF0000";
                context.stroke();
                context.fillStyle = "black";
                context.fillText("10", center.x - 6, center.y + 4);

            }
            //drew 15 points coin on the board
            else if(board[i][j] == 4)
            {
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
                context.fillStyle = "#95DEE3" ; // coin color
                context.fill();
                context.lineWidth = 2;
                context.strokeStyle = "#92A8D1";
                context.stroke();
                context.fillStyle = "black";
                context.fillText("25", center.x - 5.5, center.y + 4);

            }
            //drew hourglass on the board
            else if (board[i][j] == 5) {
                context.drawImage(clockImage,center.x - 15, center.y - 15, 30,30);
            }
            //drew fruit on the board
            else if (board[i][j] == 6) {
                context.drawImage(fruitImage, center.x -15, center.y -15, 30,30);
            }
            //drew heart on the board
            else if(board[i][j] == 7) {
                context.drawImage(heartImage, center.x - 18, center.y - 17, 35, 35);
            }
        }
    }
 }

function drawMonsters(){
    //play all the monsters in the monsters array in thet defaultive cells
    for(var i = 0; i < monstersArray.length; i++)
    {
        context.drawImage(monstersArray[i].img[Math.floor((monsterPicCount % (monster.img.length * 2)) / 2)], monstersArray[i].x, monstersArray[i].y, 40, 40);
    }
    monsterPicCount ++;
}

function drawBonus(){
    if(bonusCreature != null)
    context.drawImage(bonusCreature.img[Math.floor((monsterPicCount % (bonusCreature.img.length * 3)) / 3)], bonusCreature.x, bonusCreature.y, 40, 40);
}

function Draw() {
  
    var lblScore = document.getElementById("lblScore");
    var lblTime = document.getElementById("lblTime");
    canvas.width=canvas.width; 

    context.strokeRect(0,0,canvas.width,160);
    context.strokeRect(0,200,canvas.width,200);
    context.clearRect(1,1,canvas.width - 2, canvas.height - 2);

    lblScore.value = score;
    lblTime.value = (timeLeft/1000).toFixed(2);
    
    drewPacman();
    drawFitcherOnBord();
    drawMonsters();  
    drawBonus();

    //write "Get Ready" on the canvas
    if(!ready) {
        context.font= "45px Verdana";
        context.fillStyle = "white";
        context.fillText("Get Ready", 280, 160);
    }
}

function UpdatePosition()
{
    ready = true;
    //reset the time parameters values 
    var timeNow = Date.now();
    var delta = timeNow - timeThen;
    timeLeft -= delta;

    if(timeLeft <= 0)
        timeLeft = 0;

    pacmanPlay(pacman);

    if(bonusCreature != null)
    {
        bonusPlay(bonusCreature);
         //check if there is a collision between the pacman and one of the bonus -> if there is the player get 50 more points
        if (checkIfCollision(pacman, bonusCreature)) {
            score += 50;
            bonusCreature = null;
        }
    }

    //each monster play her move & after the move check collisions
    for(var i = 0; i < monstersArray.length; i++) {
        monsterPlay(monstersArray[i]);
        //check if there is a collision between the pacman and one of the monsters - if ther is-> the player lose one lives
        if(checkIfCollision(monstersArray[i], pacman))  {livesDown(); }       
    }

    //if the game time is finished -> write the player a massage acording to his scor
    if(timeLeft <= 0){
        noMoreTime();
    }
    //if the player lives is finished -> write the player a massage "You Lost!"
    else if(lives <= 0){
        noMoreLives();
    }
    else
        Draw();

    timeThen = timeNow;
}

function noMoreTime(){
    audio.pause(); 
    audio.currentTime = 0;
    window.clearInterval(interval);
    context.font = "30px Verdana";
    context.fillStyle = "white";
    //write a massage for the plater by his score until that point
    if(score < 150)
        context.fillText("You can do better " + score + " points", 240, 160);
    else
        context.fillText("We have a Winner!!!", 240, 160);
}

function noMoreLives(){
    audio.pause();
    audio.currentTime = 0;
    window.clearInterval(interval);
    context.font = "60px Verdana";
    context.fillStyle = "white";
    context.fillText("You Lost!", 240, 160);
}

function creatBordWalls(){
 
    wallArray = [];
    //go over all the bord cells and inite all the cells value to false
    for (var i = 0; i < 20; i++) {
        wallArray[i] = new Array();
        for (var j = 0; j < 10; j++) {
            wallArray[i][j]=false;
        }
    }

    //go over all the bord cells and determine the wall cells value to true
    for (var i = 0; i < 20; i++) {
        wallArray[i] = new Array();
        for (var j = 0; j < 10; j++) {
            if(i==0 || i==19){
                if (j == 3 || j == 5)
                wallArray[i][j]=true;
            }
            if(i==1 || i==18){
                if ((j == 1) || (j == 3) || (j == 5) ||  (j == 7) || (j == 8))
                wallArray[i][j]=true;
            }
            if(i==2 || i==17){
                if((j == 1) || (j ==7) || (j ==8))
                wallArray[i][j]=true;
            }
            if(i==3 || i==16){
                if ((j == 3) || (j == 4) || (j == 5))
                wallArray[i][j]=true;
            }
            if(i==4 || i==15){
                if ((j == 1) || (j == 4) || (j == 5) || (j == 6) || (j == 8))
                wallArray[i][j]=true;
            }
            if(i==5 || i==14){
                if((j == 1) || (j == 2) ||  (j == 8))
                wallArray[i][j]=true;
            }
            if(i==6 || i==13){
                if ((j == 1) || (j == 4) || (j == 5) || (j == 7) || (j == 8))
                wallArray[i][j]=true;
            }
            if(i==7 || i==12){
                if ((j == 3) || (j == 4))
                wallArray[i][j]=true;
            }
            if(i==8 || i==11){
                if ((j == 0) || (j == 1) || (j == 6) || (j == 8) || (j == 9))
                wallArray[i][j]=true;
            }
            if(i==9 || i==10){
                if ((j ==0) || (j == 1) || (j == 3) || (j == 5) || (j == 6) || (j == 8) || (j == 9))
                wallArray[i][j]=true;
            }
        }
    }
}


function createMonster(type)
{
    monster = new Object();
    //set the new monster fields values
    monster.type = type;
    monster.lastmove = -1;

    //chose the corect img by the monster type
    if(monster.type == 0) {
        monster.img = [monster1];
    }
    else if(monster.type == 1) {
        monster.img = [monster2];
    }
    else if(monster.type ==  2) {
        monster.img = [monster3];
    }
    return monster;
}

function getNewScoreType(i, j){
    if(board[i][j] > 1){
        var item = board[i][j];
        board[i][j] = 0;
        return item;
    }
    else
        return 0;
}

function heuristicsPathValue(direction, positionX, positionY, monsterType)
{
    if(direction == 1) positionY -= 5;   
    else if(direction == 2) positionY += 5;    
    else if(direction == 3) positionX -= 5;        
    else if(direction == 4) positionX += 5;
        
    var diffX = Math.abs(pacman.x - positionX);
    var diffY = Math.abs(pacman.y - positionY);

    var leftDistancePacmanX = pacman.x;
    var rightDistancePacmanX = 760 - pacman.x;
    var leftDistanceMonsterX = positionX;         
    var rightDistanceMonsterX = 760 - positionX;

    //returns different huristic for each montster tupe
    var huristic1;
    if(monsterHutisticCounter % 2 == 0){
        huristic1=diffX;}
    else
        huristic1=diffY;

    if(monsterType == 0)    {           
        monsterHutisticCounter++;
        if(monsterHutisticCounter % 2 == 0){
            huristic1=diffX;
            return diffX;
        }
        else{ 
            huristic1=diffY;
            return diffY;}          
    }

    var normalPath = diffX + diffY;
    if(monsterType == 1) {                          
        return normalPath;
    }

    if(monsterType == 2) {       
        var distanceThroughLeftHole = diffY + (leftDistanceMonsterX + rightDistancePacmanX);
       var distanceThroughRightHole = diffY + (rightDistanceMonsterX + leftDistancePacmanX);
        return Math.min(normalPath, distanceThroughLeftHole, distanceThroughRightHole);
     
    }
    
}

function makeMove(direction, creature, speed)
{
    if(direction == 1)  creature.y -= 5 * speed;      
    else if(direction == 2) creature.y += 5 * speed;
    else if(direction == 3) { 
        creature.x -= 5 * speed;
        if(creature.x <= 0 && creature.y == 160)
            creature.x = 760 - Math.abs(creature.x);      
    }
    else if(direction == 4) {
        creature.x += 5 * speed;
        if (creature.x >= 760 && creature.y == 160)        
            creature.x = Math.abs(760 - creature.x);
    }
}


function isPossibleMove(direction, X, Y)
{
    //check if moving up is a possible move
    if(direction==1) {       
        if( Y > 0 && X%40 == 0 &&  (Y % 40 != 0 || board[X / 40][Y / 40 - 1] != 1))
            return  true;
    }
    //check if moving down is a possible move
    else if(direction==2){        
        if(X % 40 == 0 && Y < 360 && (Y % 40 != 0 || board[X/40][Y/40 + 1] != 1))
            return  true;
    }
    //check if moving left is a possible move
    else if(direction==3){        
        if(Y % 40 == 0 && ((X > 0 && (X % 40 != 0 || board[X/40 - 1][Y/40] != 1)) || (X <= 0 && Y == 160)))
            return  true;
    }
    //check if moving right is a possible move
    else if(direction==4) {      
        if(Y % 40 == 0 && ((X < 760  &&  (X % 40 != 0 || board[X / 40 + 1][Y / 40] != 1)) ||(X >= 760 &&  Y == 160)))       
            return  true;
    }
    return  false;
}


function pacmanPlay(pacman)
{
    var key = GetKeyPressed();
    if(isPossibleMove(key,pacman.x, pacman.y))
        pacmanDirection = key;

    if(isPossibleMove(pacmanDirection,pacman.x, pacman.y))
        makeMove(pacmanDirection,pacman, 1);

    //set the "scoreType" if the pacman ove to an empty cell
    var scoreType = getNewScoreType(Math.round(pacman.x /40), Math.round(pacman.y / 40));

    //add the player scores the new scores the pacmen get in thise move 
    if(scoreType > 0)
    {
        //add score by the coin type if it was a coin
        if(scoreType >= 2 && scoreType < 5) {
            if (scoreType == 2)  score += 5;               
            else if (scoreType == 3) score += 10;     
            else if (scoreType == 4) score += 25;               
            pacmanCoins--;
        }
        //add time to the player type if the pacman ate the hourglass
        else if(scoreType == 5)  timeLeft += 15000;  
        //add 100 scores to the player scores if the pacman ate the bonus         
        else if(scoreType == 6)score += 100;   
        //add one more live to the player if the pacman ate the haert          
        else if(scoreType == 7) {  
             lives++;
             if(lives == 3)
                document.getElementById("firstLife").style.visibility = "visible";
            else
                document.getElementById("secondLastLife").style.visibility = "visible";
        }
    }
}

//if the monster and pacman collied the player lopse one live 
function livesDown()
{
    if(bonusHeartCount == 0)
        bonusHeartCount = 1;

    //change the relevent status from visable to hidden
    if(lives == 3){
        document.getElementById("firstLife").style.visibility = "hidden";
    }
    else if(lives == 2){
        document.getElementById("secondLastLife").style.visibility = "hidden";
    }
    else if(lives == 1){
        document.getElementById("lastLife").style.visibility = "hidden";
    }
    lives--;

    //if the player stil have live - he didnt lost yet- then reset the board
    if(lives > 0)
        reset(board);
}

function bonusPlay(bonus){
    
    var avoidMove;
    if(bonus.lastmove % 2 == 0)  
        avoidMove = bonus.lastmove - 1;
    else  avoidMove = bonus.lastmove + 1;
      
    //go over all the bonus move option and collect all the ligal moves
    var possibleBonusMoves = []
    for(var i = 1; i < 5; i++){
        if(isPossibleMove(i,bonus.x, bonus.y) && avoidMove != i)
            possibleBonusMoves.push(i);
    }

    //chose random move frome the bonus ligal moves array
    var newMove = possibleBonusMoves[Math.floor(Math.random() * possibleBonusMoves.length)];
    makeMove(newMove, bonus, 1);

    //update the bonus last move fieldto be the move he just play
    bonus.lastmove = newMove;
}

function monsterPlay(monster)
{
    var newMove;
    if(monster.lastmove%2 == 0)
          avoidMove = monster.lastmove - 1;
    else
          avoidMove = monster.lastmove + 1;

    //chose the monster best move - chose between the heuristics Path Value to 1200
    //if the heuristics is not the beat one chose with random help
    var bestMoveValue = 1200;
    for(var i = 1; i < 5; i++)
    {
        if(avoidMove != i && isPossibleMove(i,monster.x, monster.y))
        {
            var value = heuristicsPathValue(i,monster.x, monster.y,monster.type)
            if(value < bestMoveValue){
                newMove = i;
                bestMoveValue = value;
            }
            else if(value == bestMoveValue){
                var random = Math.random();
                if(random < 0.5)
                newMove = i;
            }
        }
    }

    //play the chosen move
    makeMove(newMove, monster, 0.8);

    //update the bonus last move fieldto be the move he just play
    monster.lastmove = newMove;
}


function checkIfCollision(A, B){
    //check if A,B are in the same cell- if they are return true -> we have a collision
    var deltaX = Math.abs(A.x - B.x);
    var deltaY = Math.abs(A.y - B.y);
    if(deltaX < 25 && deltaY < 25)
        return true;
    return false;
}

//called by the "backToSetup" button
function backToSetup() {  
    window.clearInterval(interval);
    window.clearTimeout(timeout);
    audio.pause();
    audio.currentTime = 0;
    document.getElementById("game").style.display = "none";
    document.getElementById("setup").style.display = "block";
}



