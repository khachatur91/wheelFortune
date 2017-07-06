import Phaser from 'phaser'
import Game from '../main'

export default class SplayState extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#1b1a23'
    this.isLoaded = false
    this.isTweenComplete = false
  }
  preload () {
    this.logo = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'logo')
    this.logo.alpha = 0
    this.logo.anchor.setTo(0.5)
    let tween = this.game.add.tween(this.logo)
    tween.to({alpha: 1}, 3000, Phaser.Easing.Quadratic.Out, false, 1000).to({alpha: 0}, 3000, Phaser.Easing.Quadratic.Out, true)
    tween.onComplete.add(this.onTweenComplete, this)
    this.game.load.pack('initial', 'assets/assets.json')
    this.game.load.start()
  }

  create () {
    this.isLoaded = true
    if (this.isTweenComplete) {
      this.state.start(Game.STATE_GAME)
    }
  }

  onTweenComplete () {
    console.log("Complete")
    this.isTweenComplete = true
    if (this.isLoaded) {
      this.state.start(Game.STATE_GAME)
    }
  }
}
