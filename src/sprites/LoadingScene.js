/**
 * Created by khachatur on 5/26/17.
 */

import Phaser from 'phaser'

export default class LoadingScene extends Phaser.Group {
  constructor (game) {
    super(game)

    this.game.add.image(0, 0, 'loading', 'loadingScreenBg.png')
    this.game.add.image(this.game.world.centerX, 300, 'loading', 'loadingPaper.png').anchor.setTo(0.5)
    this.game.add.image(this.game.world.centerX, 600, 'loading', 'compas.png').anchor.setTo(0.5)
    this.arrow = this.game.add.image(943, 572, 'loading', 'compasElement.png')
    this.arrow.anchor.setTo(0.5)
    this.loadingLabel = this.game.add.text(this.game.world.centerX, 270, 'loading')
    this.loadingLabel.font = 'PT Sans'
    this.loadingLabel.fill = '#8b3d29'
    this.loadingLabel.anchor.x = 0.5
    this.loadingLabel.padding.set(5, 5)
    this.loadingLabel.fontSize = 50
    this.loadingLabel.text += '...'
    this.tweenArrow()
  }

  tweenArrow () {
    this.tween = this.game.add.tween(this.arrow)
    let duration = this.game.rnd.integerInRange(1000, 4000)
    let rotation = this.game.rnd.realInRange(-Math.PI, Math.PI)
    this.tween.onComplete.add(this.tweenArrow, this)
    this.tween.to({rotation: rotation}, duration, Phaser.Easing.Bounce.In, true).start()
  }

  destroy () {
    super.destroy()
    this.tween.stop()
  }
}
