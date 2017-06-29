import Phaser from 'phaser'
import PhaserNineSlice from '@orange-games/phaser-nineslice'
import Game from '../main'

export default class BootState extends Phaser.State {
  init () {
    this.game.stage.backgroundColor = '#3498db'
    this.game.renderer.renderSession.roundPixels = true

    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true
    if (__DEV__) {
      this.game.time.advancedTiming = true
    }
    this.game.plugins.add(PhaserNineSlice.Plugin)
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
