/**
 * Created by ashot on 6/9/17.
 */

import Phaser from 'phaser'
import Popup from '../Popup'

export default class EmailPopup extends Popup {
  constructor (game) {
    super(game, 'atlas3-1', 'laptopEmail.png')
    this.onSendButtonClick = new Phaser.Signal()

    this.sendButton = this.game.add.sprite(680, 655, 'general-1', 'simpleSquare.jpg', this)
    this.sendButton.width = 70
    this.sendButton.height = 40
    this.sendButton.alpha = 0
    this.sendButton.inputEnabled = true
    this.sendButton.events.onInputUp.add(this.onButtonClick, this)
    this.sendButton.input.useHandCursor = true
  }

  onButtonClick () {
    this.onSendButtonClick.dispatch()
  }
}
