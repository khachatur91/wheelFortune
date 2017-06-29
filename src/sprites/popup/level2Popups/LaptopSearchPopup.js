/**
 * Created by khachatur on 4/26/17.
 */
import Phaser from 'phaser'
import Popup from '../Popup'

export default class LaptopPopup extends Popup {
  onPrintEvent = new Phaser.Signal();

  constructor (game) {
    super(game, 'atlas1', 'laptop-zoom.png')

    this.printBtn = this.game.add.sprite(1025, 280, 'atlas1', 'print-button.png', this)
    this.printBtn.inputEnabled = true
    this.printBtn.events.onInputDown.add(this.printPhoto, this)
  }

  printPhoto () {
    this.onPrintEvent.dispatch()
  }
}
