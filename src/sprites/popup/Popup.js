/**
 * Created by khachatur on 4/26/17.
 */
import Phaser from 'phaser'
import BaseLevel from '../../states/GameState'

export default class Popup extends Phaser.Group {
  constructor (game, key, frame) {
    super(game, 0, 0)

    this.closeEvent = new Phaser.Signal()
    this.onPickAnimationComplete = new Phaser.Signal()

    let inactiveBgGraphics = this.game.make.graphics()
    inactiveBgGraphics.beginFill(0)
    inactiveBgGraphics.drawRect(0, 0, game.world.width, game.world.height)
    inactiveBgGraphics.endFill()

    this.inactiveBg = this.game.add.sprite(0, 0, inactiveBgGraphics.generateTexture(), null, this)
    this.inactiveBg.alpha = 0.7
    this.inactiveBg.inputEnabled = true
    this.inactiveBg.events.onInputUp.add(this.closeHandler, this)

    this.image = this.game.add.sprite(game.world.centerX, game.world.centerY, key, frame, this)
    this.image.anchor.setTo(0.5)
  }

  closeHandler () {
    this.closeEvent.dispatch()
  }

  setInfoPanel (infoText) {
    if (infoText) {
      this.infoPanel = this.game.add.sprite(this.game.world.centerX, 0, 'general-1', 'infoPanel.png', this)
      this.infoPanel.position.y = this.game.height - this.infoPanel.height
      this.infoPanel.anchor.x = 0.5

      this.infoText = this.game.add.text(0, 30, infoText, null, this)
      this.infoText.anchor.x = 0.5
      this.infoText.wordWrap = true
      this.infoText.wordWrapWidth = 1200
      // this.infoText.padding.set(5, 5)
      this.infoText.font = 'Bangers'
      this.infoText.fontSize = 30
      this.infoText.fill = '#ffffff'
      this.infoPanel.addChild(this.infoText)
    }
  }

  removeInfoPanel () {
    if (this.infoPanel) {
      this.infoPanel.destroy()
    }
  }

  pickItem (item) {
    let itemTween = this.game.add.tween(item.scale)
    let x = item.x - 50
    let y = item.y - 100
    itemTween.to({x: 1, y: 1}, BaseLevel.PICK_ANIMATION_DURATION, Phaser.Easing.Back.Out)
    this.game.add.tween(item).to({x: x, y: y}, BaseLevel.PICK_ANIMATION_DURATION, Phaser.Easing.Back.Out).start()

    itemTween.onComplete.add(this.pickTweenAnimationComplete.bind(this, item))
    itemTween.start()
  }

  pickTweenAnimationComplete (item) {
    this.onPickAnimationComplete.dispatch(item)
  }

  changeImage (key, frame) {
    if (this.image) {
      this.image.destroy()
    }
    this.image = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, key, frame, this)
    this.image.anchor.setTo(0.5)
  }
}
