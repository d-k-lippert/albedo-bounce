
import cloudImg from "./assets/images/cloud.png";


class Cloud extends Phaser.Physics.Arcade.Sprite {

    constructor(scene){
        //const vel = 250;
        let xComp = 200;
        //let yComp = Math.sqrt((Math.pow(vel, 2))-(Math.pow(xComp, 2)));


        //this.body.velocity
        super(scene,0,100,'cloud');
        this.scene = scene;
        scene.physics.add.image('cloud', cloudImg);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(10);
        this.body.setBounce(1);
        this.setScale(0.8);
        this.setVelocity(xComp, 0);
        this.setImmovable();
    }


    update(freq){

        this.setScale((freq)/100);

    }

}
export default  Cloud