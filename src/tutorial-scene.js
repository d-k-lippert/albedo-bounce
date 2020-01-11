import {screenable} from "./screenable";

export default class TutorialScene extends Phaser.Scene {

    constructor ()
    {
        super('TutorialScene');
        this.video1= null;

    }

    preload ()
    {
        this.load.video('tutorialVid', "./src/assets/images/tutorialvid.mp4");
        console.log("intro works")

    }

    create ()
    {
        this.video1 = this.add.video(960,540,"tutorialVid");
        this.video1.setMute(true);
        this.video1.play(true);
        this.video1.setLoop(true);

        this.textStyle = {
            font: 'bold 18px Arial',
            fill: '#FFF'
        };
        this.userInputs = new Map ();
        this.triggerGame=false;


        screenable.events.onNewUser.subscribe((user) =>{
            this.userInputs.set(user.userID,{
                currentValue: 50
            })
            screenable.controller.disableInput(user,'slider','1');
            screenable.controller.disableInput(user,'slider','2');
        });
        this.unsub = screenable.events.onButtonPress.subscribe((user, button)=>{
            this.triggerGame=true;
            this.unsub();
            this.scene.start('GameScene');
        });
        screenable.events.onSliderChange.subscribe((user,slider)=>{
            if(slider.identifier=='1'){

                if(this.userInputs.has(user.userID)){
                    if(slider.getValue()===100 && this.triggerGame===false){
                        this.triggerGame=true;
                        this.scene.start('GameScene')
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
/*
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start game', this.textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true });
*/
    }
    update(){

    }
}