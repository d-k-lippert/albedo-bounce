export default class IntroScene extends Phaser.Scene {

    constructor ()
    {
        super('IntroScene');
    }

    preload ()
    {
        console.log("intro works")
        this.scene.start('GameScene')
    }

    create ()
    {


    }
    update(){

    }
}