import photonYellow from "./assets/images/photon-yellow.png";
import iceblock from "./assets/images/ice.png";
import groundImage from "./assets/images/meadow-layers/ground.png";
import frostGroundImage from "./assets/images/arctic-bg/ground.png";
import cloudimage from "./assets/images/cloud.png";
import groundBounce from "./assets/images/winter_ground_layer2.png";
import photonRedIMG from "./assets/images/photon-red.png";
import sliderImage from "./assets/images/slider.png";
import backgroundImage from "./assets/images/arctic-bg/sky.png";
import bg from "./assets/images/arctic-bg/mountains.png";
import bg1 from "./assets/images/arctic-bg/mountains-copy.png";
import bgMid from "./assets/images/arctic-bg/ground2.png";
import runnerSprite from "./assets/images/maennchen.png";
import Generator from "./cloud-generator";
import {screenable} from "./screenable";
import Photon from "./photon";

export default class GameScene extends Phaser.Scene {


    constructor ()
    {
        super('GameScene');
    }

    preload ()
    {
        this.load.image('photon', photonYellow);
        this.load.image('ices', iceblock);
        this.load.image('ground', groundImage);
        this.load.image('artic-ground', frostGroundImage);
        this.load.image('cloud', cloudimage);
        this.load.image('photonRed', photonRedIMG);
        this.load.image('slide', sliderImage);
        this.load.image('background', backgroundImage);
        this.load.image('mountainsBack', bg);
        this.load.image('mountainsBackFrost', bg1);
        this.load.image('mountainsMid', bgMid);
        this.load.image('groundBounce', groundBounce);

        this.load.spritesheet('runnerSpriteSheet', runnerSprite, {
            frameWidth:64,
            frameHeight:64
        });
    }

    create ()
    {
        // We are going to use these styles for texts
        this.textStyle = {
            font: 'bold 18px Arial',
            fill: '#FFF'
        };

        this.triggerGame=false;
        this.triggerWonGame=false;
        this.score=500;
        this.destroyWidth=this.game.config.width + 200;
        this.photons = [];
        this.clouds = [];
        this.generator = new Generator(this);
        this.userInputs = new Map ();
        this.triggerGameOver = false;
        this.showWonGame = false;

        //dynamic Background variables
        this.beginningSettingBackground=true;
        this.mountainsFrostOnce=true;
        this.mountainsMeltOnce= false;

        this.groundFrostOnce = true;
        this.groundMeltOnce = false;


        this.background = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'background')
            .setOrigin(0,0)
            .setScrollFactor(0);

        //Normal Mountains
        this.mountainsBack = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'mountainsBack')
            .setOrigin(0,0)
            .setScrollFactor(0)
            .setAlpha(1);

        this.mountainsBackFrost = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'mountainsBackFrost')
            .setOrigin(0,0)
            .setScrollFactor(0)
            .setAlpha(0);
        this.fadeToFrostMountains=this.tweens.add(
            {
                targets:this.mountainsBackFrost,
                alpha:{from:0, to:1},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });

        this.fadeToNormalMountains=this.tweens.add(
            {
                targets:this.mountainsBackFrost,
                alpha:{from:1, to:0},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            }
        );

        this.mountainsMid = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'mountainsMid')
            .setOrigin(0,0)
            .setScrollFactor(0);


        this.slide = this.physics.add.image(60, 500, 'slide')
            .setScale(0.5);


        this.atmo = this.physics.add.staticGroup({
            key: 'ices',
            frameQuantity: 30,
            gridAlign: { width: 30, cellWidth: 60, cellHeight: 1, x: this.cameras.main.centerX - 600, y: -130},
            visible:false
        });


        this.groundBounce= this.physics.add.image(0, this.game.config.height-150, 'groundBounce')
            .setOrigin(0,0)
            .setScale(0.25)
            .setDepth(-1)
            .setImmovable();


        /*this.ices = this.physics.add.staticGroup({
            key: 'ices',
            frameQuantity: 30,
            gridAlign: { width: 300, cellWidth: 60, cellHeight: 60, x: this.cameras.main.centerX - 900, y: this.game.config.height-150}
        });*/
        this.ground =this.add.tileSprite(0,0,this.game.config.width,this.game.config.height, 'ground')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(1);


        this.FrostGround =this.add.tileSprite(0,0,this.game.config.width,this.game.config.height, 'artic-ground')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(1);

        this.fadeToFrostGround=this.tweens.add(
            {
                targets:this.FrostGround,
                alpha:{from:0, to:1},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });
        this.fadeToMeltGround=this.tweens.add(
            {
                targets:this.FrostGround,
                alpha:{from:0, to:1},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });







        this.runner=this.add.sprite(50, this.game.config.height-200, 'runnerSpriteSheet')
            .setDepth(10);
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
        this.runner.scaleX= 3;
        this.runner.scaleY= 3;

        this.runner.play('idle');



//in zweiter scene wieder enabled
        //screenable.controller.disableInputForAll('slider','2');
        /* screenable.events. */
        screenable.controller.disableInputForAll('button', 's');

        screenable.events.onNewUser.subscribe((user) =>{
            screenable.controller.disableInput(user,'button','s');
            this.userInputs.set(user.userID,{
                currentValue: 50
            })
            screenable.controller.disableInput(user,'slider','2');
        });
        screenable.events.onSliderChange.subscribe((user,slider)=>{
            if(slider.identifier=='1'){

                if(this.userInputs.has(user.userID)){
                    if(this.triggerGame===false){
                        this.triggerGame=true;
                        this.startGame();
                    }
                    this.userInputs.get(user.userID).currentValue = slider.getValue();
                    //console.log("usernumbers ", screenable.countOnlineUsers());
                    //console.log("userinput", userInputs.get(user.userID).currentValue );

                    let userInputSum= 0;

                    for (let [key, value] of this.userInputs)
                    {
                        userInputSum+=value.currentValue;
                        //console.log(key + " = " + value.currentValue);
                    }
                    //console.log(userInputSum);
                    this.freq = (((userInputSum*3)/screenable.countOnlineUsers())+40);
                }
                else
                {
                    this.userInputs.set(user.userID,{
                        currentValue: 50})
                }
            }
        });

        this.scoreText = this.add.text(20, 20, 'Score: 0', this.textStyle);

        this.gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Game over!', this.textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111', fill: '#e74c3c' })
            .setVisible(false);

        this.wonTheGameText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'You won the game!', this.textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111', fill: '#27ae60' })
            .setVisible(false);



        /*this.startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start game', this.textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })*/

        this.physics.add.collider(this.photons, this.groundBounce, this.iceHit, null, this);
        this.physics.add.collider(this.photons, this.atmo, this.hitAtmo, null, this);


    }


     startGame()
    {
        //this.startButton.destroy();
        //console.log("usernumbers ", screenable.countOnlineUsers());
        //rotation = 'left';
        this.generator.generatorStartCloudproducing();
        this.bgStartMoving = true;
        this.startMovingRunner=true;
        this.initializeMovement=true;
        this.playIdleOnce=true;
        this.startRepeater.call(this);
        this.repeatCoolDown.call(this);
        //this.fadeToFrost.play();
    }


    repeatCoolDown(){
        this.CoolDown = this.time.addEvent({
            delay: 3000,
            callback: this.coolDown,
            loop: true,
            callbackScope: this
        }
        )
    }

    coolDown(){
        this.score += 50;
        this.slide.setPosition(60, this.score);
        this.scoreText.setText(`Score: ${this.score}`);
        }


    iceHit(photons,groundBounce)
    {
        this.score -= 50;
        this.slide.setPosition(60, this.score);
        this.scoreText.setText(`Score: ${this.score}`);
        photons.setTexture('photonRed');
        this.physics.add.collider(photons, this.generator.getClouds(), this.cloudHit, null, this);
        this.tweens.add(
            {
                targets: groundBounce,
                ease: 'Power1',
                onComplete: () =>
                {}
            });
    }

     cloudHit() {
         this.slide.setPosition(60, this.score);
         this.scoreText.setText(`Score: ${this.score}`);
         //this.fadeToNormal.play();

     }

     hitAtmo(photons) {
         this.score += 25;
         this.slide.setPosition(60, this.score);
         this.scoreText.setText(`Score: ${this.score}`);
         photons.destroy();
    }

     startRepeater() {
         this.repeatPhotons = this.time.addEvent({
            delay: 4000,
            callback: this.pushPhotons,
            loop: true,
            callbackScope: this
        });
    }

     updatePhotons(){
        for (let i = 0; i < this.photons.length; i++)
        {
            if(this.score<=25 || this.score>=975 )
            {
                this.gameOverText.setVisible(true);
                this.photons[i].destroy();
                this.repeatPhotons.destroy();
            }
            if(this.runner.x===this.game.config.width){
                this.photons[i].destroy();
                this.repeatPhotons.destroy();
            }
            if (this.photons[i].y === 0)
            {
                if (this.score > 25 && this.score < 975)
                {
                    this.scoreText.setText(`Score: ${this.score}`);
                    this.slide.setPosition(60, this.score);
                }
            }
        }
    }

     pushPhotons ()
    {
        this.photons.push(new  Photon(this));
        this.updatePhotons()
    }

     stopRunner() {
         this.startMovingRunner=false;
        if(this.playIdleOnce===false){
            this.runner.play('idle');
            this.playIdleOnce=true;
        }
    }

     moveRunner(runner, speed){
        runner.x+=speed;
        if(this.playIdleOnce){
            runner.play('runToTheRight');
            this.playIdleOnce=false;
        }
        //runner.play('moveToTheRight');
    }

     updateRunner(){

        if(this.startMovingRunner && this.showWonGame===false){
            this.moveRunner(this.runner, 1);
            this.bgStartMoving=true;
        }

        if(this.score>750 || this.score<250)
        {
            this.stopRunner();
            this.bgStartMoving=false;
        }
        else if(this.score<=750 && this.score >= 250 && this.initializeMovement && this.showWonGame===false)
        {
            this.startMovingRunner=true;
            this.bgStartMoving=true;
        }
        else if(this.score<225 && this.score>=75)
        {
            this.stopRunner();
            this.bgStartMoving=false;
        }
    }

    switchToGameOver() {
        if(this.triggerGameOver===false){
             this.time.addEvent({
                delay: 3000,
                callback: this.switchToLostScene,
                callbackScope: this,
                loop: true
            });
            this.triggerGameOver=true;
        }
    }

    switchToGameWon() {
        if(this.triggerWonGame===false){
            this.time.addEvent({
                delay: 3000,
                callback: this.switchToWonScene,
                callbackScope: this,
                loop: true
            });
            this.triggerWonGame=true;
        }
    }

    switchToLostScene(){
            this.scene.start('GameOverScene')
    }

    switchToWonScene(){
            this.scene.start('LevelTwoScene')
    }

     moveBackground(){
         this.mountainsBack.tilePositionX+= 0.1;
         this.mountainsBackFrost.tilePositionX+=0.1;
         this.mountainsMid.tilePositionX+= .5;
         this.ground.tilePositionX+= 1;
    }

    checkForWonGame(){
        if(this.runner.x===this.game.config.width){
            this.showWonGame=true;
            this.bgStartMoving=false;
            this.stopRunner();
            this.wonTheGameText.setVisible(true);
            this.generator.generatorStopCloudproducing();
            this.CoolDown.destroy();
            if(this.showWonGame){
                this.switchToGameWon();
            }
        }
    }

    meltMountain()
    {

        if(this.mountainsMeltOnce===false){
            this.fadeToNormalMountains.play();
            this.mountainsMeltOnce=true;
            this.mountainsFrostOnce=false;
        }
    }

    frostMountain()
    {
        if(this.mountainsFrostOnce===false){
            this.fadeToFrostMountains.play();
            this.mountainsFrostOnce=true;
            this.mountainsMeltOnce=false;
        }
    }


    meltGround(){
        if(this.groundMeltOnce===false){
            this.fadeToMeltGround.play();
            this.groundMeltOnce=true;
            this.groundFrostOnce=false;
        }
    }

    frostGround(){
        if(this.groundFrostOnce===false){
            this.fadeToFrostGround.play();
            this.groundFrostOnce=true;
            this.groundMeltOnce=false;
        }
    }



    checkTemperature()
    {
        if(this.score>=600)
        {
            this.frostMountain();
            this.frostGround();
        }
        else
        {
            this.meltMountain();
            this.meltGround()
        }
/*
        if(this.mountainsStartFrosting && this.mountainsFrostOnce){
            this.fadeToFrost.play();
            this.mountainsFrostOnce = false;
        }
        if(this.mountainsStartMelting && this.mountainsMeltOnce){
            this.fadeToNormal.play();
            this.mountainsMeltOnce = false;
        }
        */

    }


     update()
    {
        this.checkTemperature();

        this.generator.update(this.freq,this.destroyWidth);

        if(this.bgStartMoving){
            this.moveBackground();
        }

        if(this.score<=25 || this.score>=975)
        {
            this.generator.generatorStopCloudproducing();
                this.stopRunner();
                this.bgStartMoving=false;
                this.CoolDown.destroy();
                if(this.triggerGameOver===false){
                    //this.switchToGameOver();
                }
        }
        this.checkForWonGame();
        this.updateRunner();
    }
}