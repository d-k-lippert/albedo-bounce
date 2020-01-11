import photonYellowImg from "./assets/images/photon-yellow.png";
import photonRedImg from "./assets/images/photon-red.png";
import cloudImg from "./assets/images/cloud.png";

import groundNeutralImg from "./assets/images/neutral/ground_neutral.png";
import groundFrostImg from "./assets/images/cold/ground_cold.png";
import groundDryImg from "./assets/images/warm/ground_warm.png";


import backgroundNeutralImg from "./assets/images/neutral/sky_neutral.png";
import backgroundColdImg from "./assets/images/cold/sky_cold.png";
import backgroundWarmImg from "./assets/images/warm/sky_warm.png";

import mountainsBackLayerNeutralImg from "./assets/images/neutral/mountains_neutral.png";
import mountainsBackLayerFrostImg from "./assets/images/cold/mountains_cold.png";
import mountainsBackLayerDryImg from "./assets/images/warm/mountains_warm.png";

import iceblock from "./assets/images/ice.png";
import groundBounce from "./assets/images/winter_ground_layer2.png";
import sliderImage from "./assets/images/slider.png";
import scaleImage from "./assets/images/scale.png";
import flagImg from "./assets/images/flag.png";

//import bgMid from "./assets/images/arctic-bg/ground2.png";
import runnerSprite from "./assets/images/allsprites.png";
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
        this.load.image('mountainsBackLayerDryImg', mountainsBackLayerDryImg);

        this.load.image('backgroundNeutralImg', backgroundNeutralImg);
        this.load.image('backgroundColdImg', backgroundColdImg);
        this.load.image('backgroundWarmImg', backgroundWarmImg);

        this.load.image('ices', iceblock);
        this.load.image('slide', sliderImage);
        this.load.image('scaleImg', scaleImage);
        //this.load.image('mountainsMid', bgMid);
        this.load.image('groundBounce', groundBounce);

        this.load.image('flagImg', flagImg);

        this.load.spritesheet('runnerSpriteSheet', runnerSprite, {
            frameWidth:96,
            frameHeight:96
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
        this.score=960;

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
        this.backgroundFrostOnce = false;
        this.backgroundMeltOnce = false;

        this.backgroundNeutralOnceFadeOut= false;
        this.backgroundNeutralOnce= false;

        this.backgroundDryOnce = false;
        this.backgroundMoistOnce = false;

        this.mountainsFrostOnce=false;
        this.mountainsMeltOnce= false;

        this.mountainsNeutralOnceFadeOut= false;
        this.mountainsNeutralOnce= false;

        this.mountainsDryOnce = false;
        this.mountainsMoistOnce = false;

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
            .setScrollFactor(0)
            .setAlpha(1);

        this.fadeInNeutralBackground=this.tweens.add(
            {
                targets:this.backgroundNeutral,
                alpha:{from:0, to:1},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });
        this.fadeOutNeutralBackground=this.tweens.add(
            {
                targets:this.backgroundNeutral,
                alpha:{from:1, to:0},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });


        //Frosted background
        this.frostedBackground = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'backgroundColdImg')
            .setOrigin(0,0)
            .setScrollFactor(0)
            .setAlpha(0);
        this.fadeToFrostBackground=this.tweens.add(
            {
                targets:this.frostedBackground,
                alpha:{from:0, to:1},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });

        this.fadeToMeltBackground=this.tweens.add(
            {
                targets:this.frostedBackground,
                alpha:{from:1, to:0},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            }
        );

        //Heated background
        this.driedBackground = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'backgroundWarmImg')
            .setOrigin(0,0)
            .setScrollFactor(0)
            .setAlpha(0);
        this.fadeToDryBackground=this.tweens.add(
            {
                targets:this.driedBackground,
                alpha:{from:0, to:1},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });

        this.fadeToMoistBackground=this.tweens.add(
            {
                targets:this.driedBackground,
                alpha:{from:1, to:0},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            }
        );


        //Normal Mountains
        this.mountainsNeutral= this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'mountainsBackLayerNeutralImg')
            .setOrigin(0,0)
            .setScrollFactor(0)
            .setAlpha(1);

        this.fadeInNeutralMountains=this.tweens.add(
            {
                targets:this.mountainsNeutral,
                alpha:{from:0, to:1},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });
        this.fadeOutNeutralMountains=this.tweens.add(
            {
                targets:this.mountainsNeutral,
                alpha:{from:1, to:0},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });

        //Frosted mountains
        this.frostedMountains = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'mountainsBackLayerFrostImg')
            .setOrigin(0,0)
            .setScrollFactor(0)
            .setAlpha(0);
        this.fadeToFrostMountains=this.tweens.add(
            {
                targets:this.frostedMountains,
                alpha:{from:0, to:1},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });

        this.fadeToMeltMountains=this.tweens.add(
            {
                targets:this.frostedMountains,
                alpha:{from:1, to:0},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            }
        );

        this.driedMountains = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,
            'mountainsBackLayerDryImg')
            .setOrigin(0,0)
            .setScrollFactor(0)
            .setAlpha(0);
        this.fadeToDryMountains=this.tweens.add(
            {
                targets:this.driedMountains,
                alpha:{from:0, to:1},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            });

        this.fadeToMoistMountains=this.tweens.add(
            {
                targets:this.driedMountains,
                alpha:{from:1, to:0},
                ease:'Linear',
                duration:1000,
                repeat: 0,
                yoyo: false,
                paused: true
            }
        );


        this.slide = this.physics.add.image(this.game.config.width/2, this.game.config.height-120, 'slide')
            .setScale(0.5)
            .setRotation(-22.5)
            .setDepth(12);

        this.scale = this.physics.add.image((this.game.config.width/2) ,this.game.config.height-90 , 'scaleImg')
            .setScale(0.5, 0.35)
            .setDepth(11);

        this.physics.add.image((this.game.config.width-20) ,this.game.config.height-240 , 'flagImg')
            .setScale(0.5, 0.35)
            .setRotation()
            .setDepth(11);


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
            .setDepth(6);

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








        this.runner=this.add.sprite(50, this.game.config.height-250, 'runnerSpriteSheet')
            .setDepth(10);
        this.anims.create({
            key: 'runToTheRight',
            frames: this.anims.generateFrameNumbers('runnerSpriteSheet',{start:9, end:17 }),
            frameRate: 9,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('runnerSpriteSheet',{start:0, end:4}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'freeze',
            frames: this.anims.generateFrameNumbers('runnerSpriteSheet',{start:27, end:31}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'overheat',
            frames: this.anims.generateFrameNumbers('runnerSpriteSheet',{start:18, end:22}),
            frameRate: 5,
            repeat: -1
        });
        this.runner.scaleX= 1.5;
        this.runner.scaleY= 1.5;

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

        this.scoreText = this.add.text(20, 20, 'Score: 960', this.textStyle)
            .setDepth(10);

        this.gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Game over!', this.textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111', fill: '#e74c3c' })
            .setVisible(false)
            .setDepth(10);

        this.wonTheGameText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'You won the game!', this.textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111', fill: '#27ae60' })
            .setVisible(false)
            .setDepth(10);



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
        this.playFreezeOnce=false;
        this.playOverheatOnce=false;
        this.tooCold=false;
        this.tooHot=false;
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
        this.score -= 60;
        this.slide.setPosition( ((this.score*0.5)+this.game.config.width*0.25), this.game.config.height-60);
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
         this.slide.setPosition( ((this.score*0.5)+this.game.config.width*0.25), this.game.config.height-60);
         this.scoreText.setText(`Score: ${this.score}`);
         //this.fadeToNormal.play();

     }

     hitAtmo(photons) {
         this.score += 90;
         this.slide.setPosition( ((this.score*0.5)+this.game.config.width*0.25), this.game.config.height-60);
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
            if(this.score<=0 || this.score>=2000 )
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
                if (this.score > 0 && this.score < 2000)
                {
                    this.scoreText.setText(`Score: ${this.score}`);
                    this.slide.setPosition( ((this.score*0.5)+this.game.config.width*0.25), this.game.config.height-60);
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

         if(this.tooCold){
             if(this.playFreezeOnce===false){
                 this.runner.play('freeze');
                 this.playFreezeOnce=true;
             }
         }
         if(this.tooHot){
             if(this.playOverheatOnce===false){
                 this.runner.play('overheat');
                 this.playOverheatOnce=true;
             }
         }
         if(this.tooCold===false && this.tooHot===false) {
            if(this.playIdleOnce===false){
                this.runner.play('idle');
                this.playIdleOnce=true;
            }
         }
    }

     moveRunner(runner, speed){
        runner.x+=speed;
        if(this.playIdleOnce){
            runner.play('runToTheRight');
            this.playIdleOnce=false;
        }
         if(this.playFreezeOnce){
             runner.play('runToTheRight');
             this.playFreezeOnce=false;
         }
         if(this.playOverheatOnce){
             runner.play('runToTheRight');
             this.playOverheatOnce=false;
         }
        //runner.play('moveToTheRight');
    }

     updateRunner(){

        if(this.startMovingRunner && this.showWonGame===false){
            this.moveRunner(this.runner, 0.25);
            this.bgStartMoving=true;
        }

        if(this.score>1680)
        {
            this.tooCold=true;
            this.stopRunner();
            this.bgStartMoving=false;
        }
        else if(this.score<=1680 && this.score >= 240 && this.initializeMovement && this.showWonGame===false)
        {
            this.startMovingRunner=true;
            this.bgStartMoving=true;
            this.tooCold=false;
            this.tooHot=false;
        }
        else if(this.score<240 && this.score>=0)
        {
            this.tooHot=true;
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
         this.mountainsNeutral.tilePositionX+= 0.1;
         this.frostedMountains.tilePositionX+=0.1;
         this.driedMountains.tilePositionX+=0.1;

         this.groundNeutral.tilePositionX+= 1;
         this.driedGround.tilePositionX+= 1;
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
//background functions
    meltBackground()
    {

        if(this.backgroundMeltOnce===false){
            this.fadeToMeltBackground.play();
            this.backgroundMeltOnce=true;
            this.backgroundFrostOnce=false;
        }
    }
    frostBackground()
    {
        if(this.backgroundFrostOnce===false){
            this.fadeToFrostBackground.play();
            this.backgroundFrostOnce=true;
            this.backgroundMeltOnce=false;
        }
    }
    fadeInToNormalBackground()
    {
        if(this.backgroundNeutralOnce===false){
            this.fadeInNeutralBackground.play();
            this.backgroundNeutralOnce=true;
            this.backgroundNeutralOnceFadeOut=false;
        }
    }
    fadeOutOfNormalBackground()
    {
        if(this.backgroundNeutralOnceFadeOut===false){
            this.fadeOutNeutralBackground.play();
            this.backgroundNeutralOnceFadeOut=true;
            this.backgroundNeutralOnce=false;
        }
    }
    dryBackground()
    {

        if(this.backgroundDryOnce===false){
            this.fadeToDryBackground.play();
            this.backgroundDryOnce=true;
            this.backgroundMoistOnce=false;
        }
    }
    moistBackground()
    {
        if(this.backgroundMoistOnce===false){
            this.fadeToMoistBackground.play();
            this.backgroundMoistOnce=true;
            this.backgroundDryOnce=false;
            this.driedBackground.setDepth(0);
        }
    }

    //Mountain functions
    meltMountains()
    {

        if(this.mountainsMeltOnce===false){
            this.fadeToMeltMountains.play();
            this.mountainsMeltOnce=true;
            this.mountainsFrostOnce=false;
        }
    }
    frostMountains()
    {
        if(this.mountainsFrostOnce===false){
            this.fadeToFrostMountains.play();
            this.mountainsFrostOnce=true;
            this.mountainsMeltOnce=false;
        }
    }
    fadeInToNormalMountains()
    {
        if(this.mountainsNeutralOnce===false){
            this.fadeInNeutralMountains.play();
            this.mountainsNeutralOnce=true;
            this.mountainsNeutralOnceFadeOut=false;
        }
    }
    fadeOutOfNormalMountains()
    {
        if(this.mountainsNeutralOnceFadeOut===false){
            this.fadeOutNeutralMountains.play();
            this.mountainsNeutralOnceFadeOut=true;
            this.mountainsNeutralOnce=false;
        }
    }
    dryMountains()
    {

        if(this.mountainsDryOnce===false){
            this.fadeToDryMountains.play();
            this.mountainsDryOnce=true;
            this.mountainsMoistOnce=false;
        }
    }
    moistMountains()
    {
        if(this.mountainsMoistOnce===false){
            this.fadeToMoistMountains.play();
            this.mountainsMoistOnce=true;
            this.mountainsDryOnce=false;
            this.driedMountains.setDepth(0);
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
            this.frostedGround.setDepth(5);
        }
    }
    frostGround(){
        if(this.groundFrostOnce===false){
            this.fadeToFrostedGround.play();
            this.groundFrostOnce=true;
            this.groundMeltOnce=false;
            this.frostedGround.setDepth(6);
        }
    }
    dryGround(){
        if(this.groundDryOnce===false){
            this.fadeToDriedGround.play();
            this.groundDryOnce=true;
            this.groundMoistOnce=false;
            this.driedGround.setDepth(6);
        }
    }
    moistGround() {
        if (this.groundMoistOnce === false) {
            this.fadeToMoistGround.play();
            this.groundMoistOnce = true;
            this.groundDryOnce = false;
            this.driedGround.setDepth(5);
        }
    }
    //Ende Ground-functions



    checkTemperature()
    {
        if(this.score>=1200)
        {
            this.frostBackground();
            this.frostMountains();
            this.frostGround();

            this.fadeOutOfNormalBackground();
            this.fadeOutOfNormalGround();
            this.fadeOutOfNormalMountains();
            this.fromColdToHot=true;
            this.driedGround.setAlpha(0);
        }
        else if(this.score<1200 && this.score>=720)
        {
            if(this.fromColdToHot === true){
                this.meltBackground();
                this.meltMountains();
                this.meltGround();

                this.fadeInToNormalMountains();
                this.fadeInToNormalBackground();
                this.fadeInToNormalGround();
            }
            if(this.fromHotToCold===true){
                this.moistBackground();
                this.moistGround();
                this.moistMountains();

                this.fadeInToNormalBackground();
                this.fadeInToNormalMountains();
                this.fadeInToNormalGround();
            }
        }
        else
        {
            this.dryBackground();
            this.dryGround();
            this.dryMountains();

            this.frostedGround.setAlpha(0);
            this.fadeOutOfNormalBackground();
            this.fadeOutOfNormalGround();
            this.fadeOutOfNormalMountains();
            this.fromHotToCold=true;
        }
    }


     update()
    {
        this.checkTemperature();

        this.generator.update(this.freq,this.destroyWidth);

        if(this.bgStartMoving){
            this.moveBackground();
        }

        if(this.score<=0 || this.score>=2000)
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