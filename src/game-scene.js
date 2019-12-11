import photonYellow from "./assets/images/photon-yellow.png";
import iceblock from "./assets/images/ice.png";
import groundImage from "./assets/images/arctic-bg/ground.png";
import cloudimage from "./assets/images/cloud.png";
import photonRedIMG from "./assets/images/photon-red.png";
import hottnes from "./assets/images/hot.png";
import okness from "./assets/images/ok.png";
import coldness from "./assets/images/cold.png";
import sliderImage from "./assets/images/slider.png";
import backgroundImage from "./assets/images/arctic-bg/sky.png";
import bg from "./assets/images/mountains-back.png";
import bgMid from "./assets/images/mountains-mid1.png";
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
        this.load.image('cloud', cloudimage);
        this.load.image('photonRed', photonRedIMG);
        this.load.image('slide', sliderImage);
        this.load.image('background', backgroundImage);
        this.load.image('mountainsBack', bg);
        this.load.image('mountainsMid', bgMid);

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

        this.score=250;

        this.photons = [];
        this.clouds = [];
        this.generator = new Generator(this);
        this.userInputs = new Map ();

        this.background = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height, 'background')
            .setOrigin(0,0)
            .setScrollFactor(0);

        this.mountainsBack = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height, 'mountainsBack')
            .setOrigin(0,0)
            .setScrollFactor(0);

        this.mountainsMid = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height, 'mountainsMid')
            .setOrigin(0,0)
            .setScrollFactor(0);

        this.slide = this.physics.add.image(60, 250, 'slide')
            .setScale(0.5);


        this.atmo = this.physics.add.staticGroup({
            key: 'ices',
            frameQuantity: 30,
            gridAlign: { width: 30, cellWidth: 60, cellHeight: 1, x: this.cameras.main.centerX - 600, y: -130},
            visible:false
        });

        this.ices = this.physics.add.staticGroup({
            key: 'ices',
            frameQuantity: 30,
            gridAlign: { width: 300, cellWidth: 60, cellHeight: 60, x: this.cameras.main.centerX - 900, y: this.game.config.height-150}
        });

        this.ground =this.add.tileSprite(0,0,this.game.config.width,this.game.config.height, 'ground')
            .setOrigin(0, 0)
            .setScrollFactor(0);



        this.runner=this.add.sprite(50, this.game.config.height-200, 'runnerSpriteSheet');
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
        screenable.events.onNewUser.subscribe((user) =>{
            this.userInputs.set(user.userID,{
                currentValue: 50
            })
            screenable.controller.disableInput(user,'slider','2');
        });
        screenable.events.onSliderChange.subscribe((user,slider)=>{
            if(slider.identifier=='1'){

                if(this.userInputs.has(user.userID)){
                    if(slider.getValue()===100 && this.triggerGame===false){
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


        this.startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start game', this.textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })

        this.physics.add.collider(this.photons, this.ices, this.iceHit, null, this);
        this.physics.add.collider(this.photons, this.atmo, this.hitAtmo, null, this);

    }

     startGame()
    {
        this.startButton.destroy();
        //console.log("usernumbers ", screenable.countOnlineUsers());
        //rotation = 'left';
        this.generator.generatorStartCloudproducing();
        this.bgStartMoving = true;
        this.startMovingRunner=true;
        this.initializeMovement=true;
        this.playIdleOnce=true;
        this.startRepeater.call(this);
    }

     iceHit(photons, ice)
    {
        photons.setTexture('photonRed');
        this.physics.add.collider(photons, this.generator.getClouds(), this.cloudHit, null, this);
        this.tweens.add(
            {
                targets: ice,
                ease: 'Power1',
                onComplete: () =>
                {}
            });
    }

     cloudHit(photons) {
         this.score -= 25;
         this.slide.setPosition(60, this.score);
         this.scoreText.setText(`Score: ${this.score}`);
        photons.destroy();
    }

     hitAtmo(photons) {
         this.score += 25;
         this.slide.setPosition(60, this.score);
         this.scoreText.setText(`Score: ${this.score}`);
         photons.destroy();
    }

     startRepeater() {
         this.repeatPhotons = this.time.addEvent({
            delay: 1000,
            callback: this.pushPhotons,
            loop: true,
            callbackScope: this
        });
    }

     updatePhotons(){
        for (let i = 0; i < this.photons.length; i++)
        {
            if(this.score<=50 || this.score>=450)
            {
                this.gameOverText.setVisible(true);
                this.photons[i].destroy();
                this.repeatPhotons.destroy();
            }
            if (this.photons[i].y === 0)
            {
                if (this.score > 50 && this.score < 450)
                {
                    this.scoreText.setText(`Score: ${this.score}`);
                    this.slide.setPosition(60, this.score);
                }
                else
                {
                    this.photons[i].destroy();
                    this.gameOverText.setVisible(true);
                }
            }
            this.photons[i].update();
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

        if(this.startMovingRunner){
            this.moveRunner(this.runner, .5);

        }

        if(this.score>325 && this.score<450)
        {
            this.stopRunner();
        }
        else if(this.score<=325 && this.score >= 225 && this.initializeMovement)
        {
            this.startMovingRunner=true;
        }
        else if(this.score<225 && this.score>=75)
        {
            this.stopRunner();
        }
        else{
            this.bgStartMoving=false;
        }
    }

     moveBackground(){
         this.mountainsBack.tilePositionX+= 0.1;
         this.mountainsMid.tilePositionX+= .5;
    }


     update()
    {
        this.generator.update(this.freq);

        if(this.bgStartMoving){
            this.moveBackground();
        }
        if(this.score<=50 || this.score>=450)
        {
            this.generator.generatorStopCloudproducing();
        }

        this.updateRunner();
    }
}