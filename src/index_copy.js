import Phaser from "phaser";
import {screenable} from './screenable';
import photonYellow from "./assets/images/photon-yellow.png";
import iceblock from "./assets/images/ice.png";
import cloudimage from "./assets/images/cloud.png";
import photonRedIMG from "./assets/images/photon-red.png";
import hottnes from "./assets/images/hot.png";
import okness from "./assets/images/ok.png";
import coldness from "./assets/images/cold.png";
import sliderImage from "./assets/images/slider.png";
import backgroundImage from "./assets/images/arctic-bg/sky.png";
import groundImage from "./assets/images/arctic-bg/ground.png";
import Photon from "./photon.js";
import bg from "./assets/images/mountains-back.png";
import bgMid from "./assets/images/mountains-mid1.png";
import runnerSprite from "./assets/images/maennchen.png";
import Cloud from "./cloud.js";
import Generator from "./cloud-generator.js";
//import cloudImg from "./assets/cloud-sprite.png"



let userInputs;
let repeatPhotons;         // Game object for the cloud
let ices;         // Game object for the bricks
let scoreText;      // Game object for showing score
let startButton;    // Game object for the start button
let gameOverText;   // Game object for showing "Game Over!"
let wonTheGameText; // Game object for showing "You won the game!"
let rotation;       // Flag will be used to define which direction the photon should rotate
let slide;          // Game object for showing the scale
let hot;
let ok;
let cold;
let demoText;
let background;
let photons;
let myTimer;
let atmo;
let clouds;
let freq;
let ok2;
let generator;
let timer = 30;
let score = 250;// Variable holding the number of scores
let mountainsBack;
let mountainsMid;
let bgStartMoving = false;
let runner;
let startMovingRunner=false;
let initializeMovement=false;
let playIdleOnce=false;
let triggerGame=false;
let ground;

// We are going to use these styles for texts
const textStyle = {
  font: 'bold 18px Arial',
  fill: '#FFF'
};

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundImage: '#222',
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true - Set debug: true if you want collision boxes to be drawn
      checkCollision: {
        up: false,
        down: true,
        left: true,
        right: true
      }
    }
  },
  scene: {
    preload,
    create,
    update
  }
};




//Load assets

function preload() {
  this.load.image('photon', photonYellow);
  this.load.image('ices', iceblock);
  this.load.image('ground', groundImage);
  this.load.image('cloud', cloudimage);
  this.load.image('photonRed', photonRedIMG);
  this.load.image('hot', hottnes);
  this.load.image('ok', okness);
  this.load.image('cold', coldness);
  this.load.image('slide', sliderImage);
  this.load.image('background', backgroundImage);
  this.load.image('mountainsBack', bg);
  this.load.image('mountainsMid', bgMid);

  this.load.spritesheet('runnerSpriteSheet', runnerSprite, {
      frameWidth:64,
      frameHeight:64
  });


}

/*To create the world we need to add a create function that will add all game objects to our scene.
Implementing it will probably be the longest step but once in place, adding the game functionality
will be a breeze.

We can add image objects by calling this.physics.add.image, passing in the x and y position
and the key we created inside the preload function. We assign this to the cloud variable
we defined at the beginning, since we are going to make use of it later. To center it horizontally,
 we can get the middle of the screen with cameras.main.centerX.
 To display it at the bottom, we get the height of the canvas - 50px.

 We also call setImmovable to tell Phaser this body can’t be moved by collisions. Now we can move onto the photon:

 Same as with the cloud, we center it horizontally and we position it just above the cloud on the vertical axis.
  We also want the photon to collide with the world boundaries and bounce back from them,
  this is what we achieve with the function chaining. We’ve left with the bricks:
 */


function create() {
  photons = [];
  clouds = [];
  generator = new Generator(this);
  userInputs = new Map ();

  background = this.add.tileSprite(0,0,game.config.width,game.config.height, 'background')
      .setOrigin(0,0)
      .setScrollFactor(0);

  mountainsBack = this.add.tileSprite(0,0,game.config.width,game.config.height, 'mountainsBack')
      .setOrigin(0,0)
      .setScrollFactor(0);

  mountainsMid = this.add.tileSprite(0,0,game.config.width,game.config.height, 'mountainsMid')
      .setOrigin(0,0)
      .setScrollFactor(0);

  hot = this.physics.add.image(50, game.config.height/4, 'hot')
      .setImmovable()
      .setScale(0.4);

  ok = this.physics.add.image(50, game.config.height/2, 'ok')
      .setImmovable()
      .setScale(0.360);

  ok2 = this.physics.add.image(0, 450, 'ok')
      .setScale(0.360)
      .setDepth(10);

  cold = this.physics.add.image(50, game.config.height*3/4, 'cold')
      .setImmovable()
      .setScale(0.5);

  slide = this.physics.add.image(60, 250, 'slide')
      .setScale(0.5);



  atmo = this.physics.add.staticGroup({
    key: 'ices',
    frameQuantity: 30,
    gridAlign: { width: 30, cellWidth: 60, cellHeight: 1, x: this.cameras.main.centerX - 600, y: -130},
    visible:false
  });

    ices = this.physics.add.staticGroup({
        key: 'ices',
        frameQuantity: 30,
        gridAlign: { width: 300, cellWidth: 60, cellHeight: 60, x: this.cameras.main.centerX - 900, y: this.game.config.height-150}
    });

    ground =this.add.tileSprite(0,0,game.config.width,game.config.height, 'ground')
        .setOrigin(0, 0)
        .setScrollFactor(0);



    runner=this.add.sprite(50, game.config.height-200, 'runnerSpriteSheet');
    this.anims.create({
        key: 'runToTheRight',
        frames: this.anims.generateFrameNumbers('runnerSpriteSheet',{start:143, end:151 }),
        frameRate: 20,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('runnerSpriteSheet',{start:91, end:98}),
        frameRate: 10,
        repeat: -1
    });
    runner.scaleX= 3;
    runner.scaleY= 3;

    runner.play('idle');



//in zweiter scene wieder enabled
  //screenable.controller.disableInputForAll('slider','2');
  /* screenable.events. */
  screenable.events.onNewUser.subscribe((user) =>{
    userInputs.set(user.userID,{
      currentValue: 50
    })
    screenable.controller.disableInput(user,'slider','2');
  });
    screenable.events.onSliderChange.subscribe((user,slider)=>{
      if(slider.identifier=='1'){

          if(userInputs.has(user.userID)){
            if(slider.getValue()===100 && triggerGame===false){
                triggerGame=true;
                startGame.call(this)
            }
            userInputs.get(user.userID).currentValue = slider.getValue();
            //console.log("usernumbers ", screenable.countOnlineUsers());
            //console.log("userinput", userInputs.get(user.userID).currentValue );

            let userInputSum= 0;

            for (let [key, value] of userInputs)
            {
              userInputSum+=value.currentValue;
              //console.log(key + " = " + value.currentValue);
            }
            //console.log(userInputSum);
            freq = (((userInputSum*3)/screenable.countOnlineUsers())+40);
          }
          else
          {
              userInputs.set(user.userID,{
                currentValue: 50})
          }
      }
    });


  /*For them, we are using a staticGroup. The key references our asset’s name.

  frameQuantity is used for the number of times the image will be displayed and gridAlign is used for alignments:

  width is used for the amount of items displayed on one line. Since we want to display 20 items on two lines,
  we can use a 10x2 grid.
  cellWidth and cellHeight is for each individual item.
  The image itself is 50x50px and we want 5px paddings on each side so we can go with a value of 60.
  To center it horizontally, we get centerX - (half of the width of the group).
  Lastly I also positioned it 100px from the top.*/




  /*We can create texts using the this.add.text method.
  It takes four parameters: the x and y position, the text itself and an optional styles object.
  Score will be displayed on the top left corner while “lives” will be on the top right.
  The anchor point for the texts are on the top left corner by default, so to correctly position “lives”,
  we need to move the anchor to the top right corner. This is what setOrigin is suppose to do.
  While here, let’s also add the game over and winning texts:*/

  scoreText = this.add.text(20, 20, 'Score: 0', textStyle);
  demoText = this.add.text(this.game.config.width - 150 , 20, `Countdown: ${timer}`, textStyle);


  /*We want to center them to the world. Since we have the anchor positioned on the top left corner again,
  we need to move it to the middle with setOrigin(0.5).
  I also added some padding and overrides for the default styles with setStyle.
  And as we don’t want them to be displayed at the start of the game,
  we can hide them with the setVisible method.*/
  gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Game over!', textStyle)
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({ backgroundColor: '#111', fill: '#e74c3c' })
      .setVisible(false);

  wonTheGameText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'You won the game!', textStyle)
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({ backgroundColor: '#111', fill: '#27ae60' })
      .setVisible(false);


  /*Since there’s no collision, the photon just flies around without any purpose.
  We want two collisions to happen: one between the photon and the bricks and one between the photon and the cloud.
  To create these collisions, add the following two lines as the last thing in your create function:*/



  /*
  * To make it act like a button we can register inputs by calling setInteractive.
  * Adding useHandCursor will show a pointer when hovered instead of the default cursor.
  * We can also define different event listeners on it using the on method. For hover,
  * we set a different fill color. pointerout will be the blur event where we set back the style.
  * On click — which is handled by pointerdown — we call the startGame function.*/
  startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start game', textStyle)
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({ backgroundColor: '#111' })
      .setInteractive({ useHandCursor: true })
      /*.on('pointerdown', () => startGame.call(this))
      .on('pointerdown', () => clock())
      .on('pointerover', () => startButton.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => startButton.setStyle({ fill: '#FFF' }))
      .on('pointerdown', () => startRepeater.call(this));*/

  this.physics.add.collider(photons, ices, iceHit, null, this);
  this.physics.add.collider(photons, atmo, hitAtmo, null, this);
}



/*We can remove the start button by calling destroy on it.
To shoot out the photon we can apply a force using setVelocity.
It takes in two forces, one on the x and one on the y axis.
We also set the rotation to left which we will later use to rotate the photon as it flies.
Finally, to move the cloud we can add an event listener on the whole scene with input.on.
Inside the callback, we set the cloud’s x position to the mouse x position.
To avoid moving it outside of the screen, we force pointer.x to be between a min and a max value.
This is done using the Math.Clamp method.*/
function startGame()
{
  startButton.destroy();
  ok2.setVelocityX(40);
  //console.log("usernumbers ", screenable.countOnlineUsers());
  //rotation = 'left';
  generator.generatorStartCloudproducing();
  bgStartMoving = true;
  startMovingRunner=true;
  initializeMovement=true;
  playIdleOnce=true;
  clock();
  startRepeater.call(this);
}

function clock() {
  myTimer = setInterval(myClock, 1000);

  function myClock()
  {
    document.getElementById('demoText');;
    demoText.setText(`Countdown: ${--timer}`);

    if (score<=50 || score>=450)
    {
      clearInterval(myTimer);
      //photons.destroy();
      //photon.destroy();
      gameOverText.setVisible(true);
    }
    else if(timer === 0 )
    {
      wonTheGameText.setVisible(true);
      clearInterval(myTimer);
    }
  }
}

/*
* We change the brick’s texture and after a short time, we shrink it till it disappears.
* Of course we also want to give some score to the player so they don’t leave right away.
* Once no more bricks left, we can display the “You won!” message.
*
*
* To switch between textures we can use the setTexture method where we pass in the key of the preloaded asset.
* After increasing the score, we simply re-set the text to be updated. To create the animation, we can use tween.add.
As you can see, we have a bunch of configuration options to set.
* targets will determine which game object will be animated. We can add easings for the animation and a duration.
*  By setting scaleX and scaleY to 0, we can shrink it down and by using angle: 180 it will rotate it by 180° in the meantime.
* To stop the animation from starting as soon as the collision happens, we can also specify a delay.
Once the animation completes, we can get rid of the brick and also do a check.
* If there’s no more bricks on the screen, we can remove the photon and display the “You won!” message.*/

function iceHit(photons, ice)
{
  photons.setTexture('photonRed');
  this.physics.add.collider(photons, generator.getClouds(), cloudHit, null, this);
  this.tweens.add(
    {
      targets: ice,
      ease: 'Power1',
      onComplete: () =>
      {}
    });
}

/*Hitting the cloud

We could actually get away without adding any functionality for hitting the cloud as the photon will bounce off of it,
 since we already add.collider defined and bounce set to 1.
 With just a couple of lines however we can create some randomness in the game:

 If the photon’s x position is less than the cloud’s x position, it means that the photon hit the left side of the cloud.
 In this case, we want to apply a negative x force to shoot it to the left side.
 Otherwise, it hit the right hand side in which case, we shoot it to the right.
  If it falls completely perpendicular on the cloud, we still want to add some x velocity to avoid shooting it straight up.
 We will also switch direction between the rotation based on which side of the cloud the photon falls.*/


function cloudHit(photons) {
  score -= 25;
  slide.setPosition(60, score);
  scoreText.setText(`Score: ${score}`);
  photons.destroy();
}

function hitAtmo(photons) {
  score += 25;
  slide.setPosition(60, score);
  scoreText.setText(`Score: ${score}`);
  photons.destroy();
}

function startRepeater() {
  repeatPhotons = this.time.addEvent({
    delay: 1000,
    callback: pushPhotons,
    loop: true,
    callbackScope: this
  });
  update();
}

function updatePhotons(){
  for (let i = 0; i < photons.length; i++)
  {
    if(score<=50 || score>=450 || timer ===0)
    {
      gameOverText.setVisible(true);
      photons[i].destroy();
      repeatPhotons.destroy();
    }
    if (photons[i].y === 0)
    {
      if (score > 50 && score < 450)
      {
        scoreText.setText(`Score: ${score}`);
        slide.setPosition(60, score);
      }
      else
        {
        photons[i].destroy();
        gameOverText.setVisible(true);
        ok2.setVisible(false);
        ok2.setVelocityX(0);
      }
    }
    photons[i].update();
  }
}

function pushPhotons ()
{
  photons.push(new  Photon(this));
  updatePhotons()
}

function stopRunner() {
    startMovingRunner=false;
    if(playIdleOnce===false){
        runner.play('idle');
        playIdleOnce=true;
    }
}

function moveRunner(runner, speed){
    runner.x+=speed;
    if(playIdleOnce){
        runner.play('runToTheRight');
        playIdleOnce=false;
    }
    //runner.play('moveToTheRight');
}

function updateRunner(){

    if(startMovingRunner){
        moveRunner(runner, .5);

    }

    if(score>325 && score<450)
    {
        stopRunner();
    }
    else if(score<=325 && score >= 225 && initializeMovement)
    {
        startMovingRunner=true;
    }
    else if(score<225 && score>=75)
    {
        stopRunner();
    }
    else{
        bgStartMoving=false;
    }
}

function moveBackground(){
  mountainsBack.tilePositionX+= 0.1;
  mountainsMid.tilePositionX+= .5;
}


function update()
{
    generator.update(freq);

    if(bgStartMoving){
        moveBackground();
    }
    if(score<=50 || score>=450 || timer ===0)
    {
        generator.generatorStopCloudproducing();
    }

    updateRunner();
}

//texturepacker - google it
// trap code - after effects plugin

const game = new Phaser.Game(config);