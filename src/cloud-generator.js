import Cloud from "./cloud";

export default class Generator {
    constructor(scene){

        this.scene=scene;
        this.freq=100;
        this.sizeNextCloud = 100
        this.clouds=[];
        this.counter=0;
        this.isProducingClouds = false;


    }

    getClouds(){
        return this.clouds;
    }

   setFrequency(setNewFrequency){
        this.freq=setNewFrequency;
    }

    setSizeNextCloud(newSize){
        this.sizeNextCloud=newSize;
    }

    generatorStartCloudproducing(){
        this.isProducingClouds=true;
    }

    generatorStopCloudproducing(){
        this.isProducingClouds=false;
    }

    destroyClouds(){
        for (let i = 0; i < this.clouds.length; i++) {

                this.clouds[i].destroy();
        }
    }

    update(freq){


        if((this.counter > freq ) && this.isProducingClouds){
            let newCloud = new Cloud(this.scene)
            newCloud.scaleSetter(this.sizeNextCloud);
            this.clouds.push(newCloud);

            if(this.clouds.length>10){
                this.clouds[0].destroy()
                this.clouds.shift()
            }
            this.counter=0;
        }
        else{

        }
        this.counter++;
    }
}
