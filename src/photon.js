
import photonYellow from "./assets/images/photon-yellow.png";


class Photon extends Phaser.Physics.Arcade.Sprite {

    constructor(scene){
        const vel = 250;
        let xComp = 200*Math.random();
        let yComp = Math.sqrt((Math.pow(vel, 2))-(Math.pow(xComp, 2)));


        //this.body.velocity
        super(scene,window.innerWidth-(window.innerWidth*Math.random()),100,'photon');
        this.scene = scene;
        this.inAtmo = false;
        scene.physics.add.image('photon', photonYellow);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(10);
        this.body.setCollideWorldBounds(true)
        this.body.setBounce(1);
        this.setScale(0.2);
        this.setVelocity(xComp, yComp);
    }


    update(){

       /*if (this.body.y > 300) {
           this.setVelocityY(-100);
       }*/

    }

}
export default  Photon