import {screenable} from "./screenable";

export default class GameOverScene extends Phaser.Scene {

    constructor ()
    {
        super('GameOverScene');
    }

    preload ()
    {
        console.log("gameover works")

    }

    create ()
    {
        this.textStyle = {
            font: 'bold 18px Arial',
            fill: '#FFF'
        };
        this.userInputs = new Map ();
        this.triggerGame=false;
        this.startScene=false;


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
                        this.scene.start('GameScene')
                        //this.startGame();
                    }
                    if(slider.getValue()===0 && this.startScene===false){
                        this.startScene=true;
                        this.scene.start('IntroScene')
                        //this.startGame();
                    }
                    this.userInputs.get(user.userID).currentValue = slider.getValue();

                    let userInputSum= 0;

                    for (let [key, value] of this.userInputs)
                    {
                        userInputSum+=value.currentValue;
                    }
                    this.freq = (((userInputSum*3)/screenable.countOnlineUsers())+40);
                }
                else
                {
                    this.userInputs.set(user.userID,{
                        currentValue: 50})
                }
            }
        });

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Swipe up to the max to PLAY AGAIN', this.textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true });

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Swipe down go back to the START SCREEN', this.textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true });

    }
    update(){

    }
}