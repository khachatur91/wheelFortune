import Phaser from 'phaser'
import Game from '../main'

export default class BootState extends Phaser.State {
  init () {
    this.game.stage.backgroundColor = '#3498db'
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
    const
      {load} = this.game
    load.pack('initial', 'assets/assets.json')
    load.start()
  }

  create () {
    this.state.start(Game.GAME)
  }
}
