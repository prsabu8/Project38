//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, deadtrex, runningtrex, ground, groundimage, invisibleground;

var cloudsgroup, cloudimage;

var obstaclegroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var restart, restartimage, gameOver, gameoverimage;

var score=0;

var checkpoint, jump, die;

var bg, bg1;

localStorage["HighestScore"]=0;

function preload(){
  runningtrex = loadAnimation ("trex1.png", "trex3.png", "trex4.png");
  deadtrex = loadAnimation ("trex_collided.png");
  groundimage = loadImage ("ground2.png");
  cloudimage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  restartimage = loadImage("restart.png");
  gameoverimage = loadImage("gameOver.png");
  checkpoint = loadSound ("checkPoint.mp3");
  bg = loadImage ("bg.png");
  die = loadSound ("die.mp3");
  jump = loadSound ("jump.mp3");
}

function setup() {
  createCanvas(displayWidth/2, displayHeight/4);
  bg1 = createSprite (displayWidth/2, displayHeight/4, displayWidth/2, displayHeight/4);
  bg1.addImage (bg);
  trex = createSprite(displayWidth/2 - 300,displayHeight/4-20,20,50);
  trex.addAnimation("running",runningtrex);
  trex.addAnimation("collided",deadtrex);
  trex.scale=0.5;
  ground = createSprite(displayWidth/2,displayHeight/4 - 20, displayWidth,20);
  ground.addImage("ground",groundimage);
  ground.x = ground.width/2;
  ground.velocityX= -6;
  invisibleground = createSprite(displayWidth/2,displayHeight/4 - 10, displayWidth,10);
  invisibleground.visible=false;
  cloudsgroup = new Group();
  obstaclegroup = new Group();
  
  //place gameOver and restart icon on the screen
  gameOver = createSprite(displayWidth/4,displayHeight/4 - 100);
  restart = createSprite(displayWidth/4,displayHeight/4 - 60);
  gameOver.addImage(gameoverimage);
  gameOver.scale = 0.5;
  restart.addImage(restartimage);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  //set text
  textSize(18);
  textFont("Georgia");
  textStyle(BOLD);
}

function draw() {
  background("white");


  camera.position.x = trex.x;
  camera.position.y = trex.y;
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (score>0 && score%100 === 0){
      checkpoint.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 140){
      trex.velocityY = -12 ;
      jump.play();
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnclouds();
  
    //spawn obstacles
    spawnobstacles();
    
    //End the game when trex is touching the obstacle
    if(obstaclegroup.isTouching(trex)){
      gameState = END;
      die.play();
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclegroup.setVelocityXEach(0);
    cloudsgroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",deadtrex);
    
    //set lifetime of the game objects so that   they are never destroyed
    obstaclegroup.setLifetimeEach(-1);
    cloudsgroup.setLifetimeEach(-1);
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  trex.collide (invisibleground);
  
  drawSprites();

    //display score
    text("Score: "+ score, displayWidth/2,displayHeight/4 - 150);
  
}

function spawnclouds(){
  if (frameCount %50==0){
    var cloud = createSprite(displayWidth/2,displayHeight/4 - 80,40,10);
    cloud.y=Math.round(random(80,120));
    cloud.addImage("cloud",cloudimage);
    cloud.scale=0.5;
    cloud.velocityX = -6;
    cloud.lifetime=200;
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    cloudsgroup.add(cloud);
  }
}

function spawnobstacles(){
  if (frameCount %60==0){
    var obstacle = createSprite(displayWidth/2,displayHeight/4 - 35,10,40);
    obstacle.velocityX= -6;
    
    //add animation using random numbers
    var rand = Math.round(random(1,6));
    switch (rand){
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default:break;  
    }
    
    obstacle.scale=0.5;
    obstacle.lifetime=300;
    obstaclegroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  restart.visible=false;
  gameOver.visible = false;
  trex.changeAnimation("running",runningtrex);
  obstaclegroup.destroyEach();
  cloudsgroup.destroyEach();
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"]=score;
  }
  
  score = 0;
}