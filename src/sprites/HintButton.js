/**
 * Created by khachatur on 4/21/17.
 */
import Phaser from 'phaser'

export default class HintButton extends Phaser.Group {
  static HINT_COOLDOWN_DURATION = 10

  constructor (game, parent) {
    super(game, parent)

    this.onHint = new Phaser.Signal()

    this.button = this.game.add.sprite(0, 0, 'general-1', 'button-hint.png', this)

    this.disableButton = this.game.add.sprite(0, 0, 'general-1', 'idle-hint.png', this)
    this.disableButton.visible = false

    this.maskGraphics = this.game.add.graphics(this.disableButton.width, 0, this)
    this.maskGraphics.beginFill(0)
    this.maskGraphics.drawRect(0, 0, -this.disableButton.width, this.disableButton.height)
    this.maskGraphics.endFill()

    this.disableButton.mask = this.maskGraphics

    let hintButtonText = this.game.add.text(0, 0, 'hintButton', null, this)
    hintButtonText.anchor.setTo(0.5)
    hintButtonText.position.setTo(this.button.width / 2, this.button.height / 2)
    hintButtonText.fill = '#19520e'
    hintButtonText.font = 'PT Sans'
    hintButtonText.fontSize = 35

    this.button.inputEnabled = true
    this.button.events.onInputDown.add(this.clickListener, this)
  }

  startCoolDown () {
    this.disableButton.visible = true
    this.button.inputEnabled = false
    this.maskGraphics.width = this.disableButton.width
    this.maskTween = this.game.add.tween(this.maskGraphics)
    console.log(this.maskGraphics.width)
    this.maskTween.to({width: 0}, Phaser.Timer.SECOND * HintButton.HINT_COOLDOWN_DURATION)
    this.maskTween.onComplete.add(this.enableButton, this)
    this.maskTween.start()
  }

  clickListener () {
    this.onHint.dispatch()
  }

  enableButton () {
    this.disableButton.visible = false
    this.maskGraphics.width = -this.disableButton.width
    this.button.inputEnabled = true
  }
}
