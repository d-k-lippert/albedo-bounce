import Phaser from "phaser";
import IntroScene from  "./intro-scene";
import TutorialScene from  "./tutorial-scene";
import GameScene from  "./game-scene";
import GameOverScene from "./game-over-scene";
import LevelTwoScene from "./level-2.js";
//import cloudImg from "./assets/cloud-sprite.png"

const config = {
  type: Phaser.CANVAS,
  width: 1920,
  height: 1080,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundImage: '#222',
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true - Set debug: true if you want collision boxes to be drawn
      checkCollision: {
        up: false,
        down: true,
        left: true,
        right: true
      }
    }
  },
  scene: [
      IntroScene,
      TutorialScene,
      GameScene,
      GameOverScene,
      LevelTwoScene
  ]
};



let game = new Phaser.Game(config);