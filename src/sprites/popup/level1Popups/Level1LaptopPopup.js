/**
 * Created by khachatur on 4/26/17.
 */
import Phaser from 'phaser'
import Popup from '../Popup'

export default class Level1LaptopPopup extends Popup {
  constructor (game, isPaperPrinted) {
    super(game, 'atlas1-2', 'laptopZoom.png')
    this.setInfoPanel('level1-info-laptop')
    this.onPrintEvent = new Phaser.Signal()

    this.printBtn = this.game.add.sprite(0, 0, 'atlas1-1', 'print-button.png', this)
    this.printBtn.scale.setTo(0.8)
    this.printBtn.position.setTo(888, 348)
    if (!isPaperPrinted) {
      this.printBtn.inputEnabled = true
      this.printBtn.input.useHandCursor = true
      this.printBtn.events.onInputDown.add(this.printPhoto, this)
    }
  }

  printPhoto () {
    this.onPrintEvent.dispatch()
  }
}
