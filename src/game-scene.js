import photonYellowImg from "./assets/images/photon-yellow.png";
import photonRedImg from "./assets/images/photon-red.png";
import cloudImg from "./assets/images/cloud.png";

import groundNeutralImg from "./assets/images/meadow-layers/ground.png";
import groundFrostImg from "./assets/images/arctic-bg/ground.png";
import groundDryImg from "./assets/images/desert-layers/ground.png";


import backgroundNeutralImg from "./assets/images/arctic-bg/sky.png";

import mountainsBackLayerNeutralImg from "./assets/images/meadow-layers/mountains.png";
import mountainsBackLayerFrostImg from "./assets/images/arctic-bg/mountains.png";

import iceblock from "./assets/images/ice.png";
import groundBounce from "./assets/images/winter_ground_layer2.png";
import sliderImage from "./assets/images/slider.png";
//import bgMid from "./assets/images/arctic-bg/ground2.png";
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
        this.load.image('photonYellowImg', photonYellowImg);
        this.load.image('photonRedImg', photonRedImg);
        this.load.image('cloudImg', cloudImg);

        this.load.image('groundNeutralImg', groundNeutralImg);
        this.load.image('groundFrostImg', groundFrostImg);
        this.load.image('groundDryImg', groundDryImg);

        this.load.image('mountainsBackLayerNeutralImg', mountainsBackLayerNeutralImg);
        this.load.image('mountainsBackLayerFrostImg', mountainsBackLayerFrostImg);

        this.load.image('backgroundNeutralImg', backgroundNeutralImg);

        this.load.image('ices', iceblock);
        this.load.image('slide', sliderImage);
        //this.load.image('mountainsMid', bgMid);
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

        //Gamestart variablen
        this.triggerGame=false;
        this.triggerWonGame=false;

        //GameOver triggervariablen
        this.triggerGameOver = false;
        this.showWonGame = false;

        //Defaulteinstellung Score
        this.score=500;

        //Bildschirmbreite bei der Objekte zerstört werden - Performanceoptimierung
        this.destroyWidth=this.game.config.width + 200;

        //Array das zum speichern der photonen benötigt wird
        this.photons = [];

        this.clouds = [];

        //Generator, der Wolkenproduziert - abhängig der Eingabe durch das Smartphone
        this.generator = new Generator(this);

        //Steuerung der Usereingaben - wird für screenable benötigt
        this.userInputs = new Map ();


        //dynamic Background variables
        this.mountainsFrostOnce=false;
        this.mountainsMeltOnce= false;

        this.groundFrostOnce = false;
        this.groundMeltOnce = false;

        this.groundNeutralOnceFadeOut= false;
        this.groundNeutralOnce= false;

        this.groundDryOnce = false;
        this.groundMoistOnce = false;

        this.fromHotToCold = false;
        this.fromColdToHot = false;


        this.backgroundNeutral = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'backgroundNeutralImg')
            .setOrigin(0,0)
            .setScrollFactor(0);

        //Normal Mountains
        this.mountainsBack = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'mountainsBackLayerNeutralImg')
            .setOrigin(0,0)
            .setScrollFactor(0)
            .setAlpha(1);

        this.mountainsBackFrost = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'mountainsBackLayerFrostImg')
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
/*
        this.mountainsMid = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'mountainsMid')
            .setOrigin(0,0)
            .setScrollFactor(0);
*/

        this.slide = this.physics.add.image(60, 500, 'slide')
            .setScale(0.5);


        this.atmo = this.physics.add.staticGroup({
            key: 'ices',
            frameQuantity: 30,
            gridAlign: { width: 30, cellWidth: 60, cellHeight: 1, x: this.cameras.main.centerX - 600, y: -130},
            visible:false
        });


        this.groundBounce= this.physics.add.image(0, this.game.config.height-150,
            'groundBounce')
            .setOrigin(0,0)
            .setScale(0.25)
            .setDepth(-1)
            .setImmovable();


        /*this.ices = this.physics.add.staticGroup({
            key: 'ices',
            frameQuantity: 30,
            gridAlign: { width: 300, cellWidth: 60, cellHeight: 60, x: this.cameras.main.centerX - 900, y: this.game.config.height-150}
        });*/
        this.groundNeutral =this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'groundNeutralImg')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(2);

        this.fadeInNeutralGround=this.tweens.add(
            {
                targets:this.groundNeutral,
                alpha:{from:0, to:1},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });
        this.fadeOutNeutralGround=this.tweens.add(
            {
                targets:this.groundNeutral,
                alpha:{from:1, to:0},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });



        this.frostedGround =this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'groundFrostImg')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(1);

        this.fadeToFrostedGround=this.tweens.add(
            {
                targets:this.frostedGround,
                alpha:{from:0, to:1},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });
        this.fadeToMeltGround=this.tweens.add(
            {
                targets:this.frostedGround,
                alpha:{from:1, to:0},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });


        this.driedGround=this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'groundDryImg')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(1);

        this.fadeToDriedGround=this.tweens.add(
            {
                targets:this.driedGround,
                alpha:{from:0, to:1},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });
        this.fadeToMoistGround=this.tweens.add(
            {
                targets:this.driedGround,
                alpha:{from:1, to:0},
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
/*
    coolDown(){
        this.score += 50;
        this.slide.setPosition(60, this.score);
        this.scoreText.setText(`Score: ${this.score}`);
        }
*/

    iceHit(photons,groundBounce)
    {
        this.score -= 50;
        this.slide.setPosition(60, this.score);
        this.scoreText.setText(`Score: ${this.score}`);
        photons.setTexture('photonRedImg');
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
         this.score += 75;
         this.slide.setPosition(60, this.score);
         this.scoreText.setText(`Score: ${this.score}`);
         photons.destroy();
    }

     startRepeater() {
         this.repeatPhotons = this.time.addEvent({
            delay: 4500,
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
            this.moveRunner(this.runner, 0.25);
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
        // this.mountainsMid.tilePositionX+= .5;
         this.groundNeutral.tilePositionX+= 1;
         this.frostedGround.tilePositionX+= 1;
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
                //this.switchToGameWon();
            }
        }
    }

    //Mountain functions
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
    //Ende mountain functions


    //Ground functions
    fadeInToNormalGround()
    {
        if(this.groundNeutralOnce===false){
            this.fadeInNeutralGround.play();
            this.groundNeutralOnce=true;
            this.groundNeutralOnceFadeOut=false;
        }
    }
    fadeOutOfNormalGround()
    {
        if(this.groundNeutralOnceFadeOut===false){
            this.fadeOutNeutralGround.play();
            this.groundNeutralOnceFadeOut=true;
            this.groundNeutralOnce=false;
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
            this.fadeToFrostedGround.play();
            this.groundFrostOnce=true;
            this.groundMeltOnce=false;
        }
    }
    dryGround(){
        if(this.groundDryOnce===false){
            this.fadeToDriedGround.play();
            this.groundDryOnce=true;
            this.groundMoistOnce=false;
        }
    }
    MoistGround() {
        if (this.groundMoistOnce === false) {
            this.fadeToMoistGround.play();
            this.groundMoistOnce = true;
            this.groundDryOnce = false;
        }
    }
    //Ende Ground-functions



    checkTemperature()
    {
        if(this.score>=600)
        {
            this.frostMountain();
            this.frostGround();

            this.fadeOutOfNormalGround();
            this.fromColdToHot=true;
        }
        else if(this.score<600 && this.score>=400)
        {
            if(this.fromColdToHot === true){
                this.meltMountain();
                this.meltGround();
                this.fadeInToNormalGround();
            }
            if(this.fromHotToCold===true){
                this.MoistGround();
                this.fadeInToNormalGround();
            }
        }
        else
        {
            this.dryGround();
            this.fadeOutOfNormalGround();
            this.fromHotToCold=true;
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
                    this.switchToGameOver();
                }
        }
        this.checkForWonGame();
        this.updateRunner();
    }
}