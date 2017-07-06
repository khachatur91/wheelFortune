import Phaser from 'phaser'
import Game from '../main'

export default class BootState extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#1b1a23'
    this.game.renderer.renderSession.roundPixels = true

    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true

    // append a rotation convert function
    this.game.math.convertRotationRange2PI = this.convertRotationRange2PI
  }

  // wrap current rotation to appropriate one in range 0 - 2*PI
  convertRotationRange2PI (rotation) {
    return this.degToRad((this.radToDeg(rotation) % 360))
  }

  preload () {
    this.game.load.image('logo', 'assets/logo.png')
    this.game.load.start()
  }

  create () {
    this.state.start(Game.SPLASH)
  }
}
