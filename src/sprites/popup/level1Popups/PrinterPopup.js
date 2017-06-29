/**
 * Created by khachatur on 4/26/17.
 */
import Phaser from 'phaser'
import Popup from '../Popup'

export default class PrinterPopup extends Popup {
  constructor (game, isPaperVisible) {
    super(game, 'atlas1-2', 'print-zoom.png')

    this.getPictureEvent = new Phaser.Signal()
    if (isPaperVisible) {
      this.paper = this.game.add.sprite(0, 0, 'atlas1-1', 'print-paper-zoom.png', this)
      this.paper.inputEnabled = true
      this.paper.events.onInputDown.add(this.getPrintedPicture, this)
      this.paper.position.setTo(360, 570)
    }
  }

  getPrintedPicture () {
    this.pickItem(this.paper)
    this.onPickAnimationComplete.add(this.getPrintedPictureListener, this)
  }

  getPrintedPictureListener () {
    this.getPictureEvent.dispatch()
  }
}
