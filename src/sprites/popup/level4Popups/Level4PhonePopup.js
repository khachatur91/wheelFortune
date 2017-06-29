/**
 * Created by ashot on 6/2/17.
 */
import Popup from '../Popup'
import Phaser from 'phaser'
export default class Level4PhonePopup extends Popup {
  constructor (game) {
    super(game, 'atlas4-4', 'phone.png')

    this.onPhoneComplete = new Phaser.Signal()

    this.inactivePhoneBg = this.game.add.image(this.image.x, this.image.y, 'general-1', 'simpleSquare.jpg', this)
    this.inactivePhoneBg.anchor.setTo(0.5)
    this.inactivePhoneBg.alpha = 0
    this.inactivePhoneBg.width = this.image.width
    this.inactivePhoneBg.height = this.image.height
    this.inactivePhoneBg.inputEnabled = true
    this.inactivePhoneBg.events.onInputDown.add(this.getInfopanel2, this)

    this.setInfoPanel('level4-phone-info1')
  }

  getInfopanel2 () {
    if (this.infoPanel) {
      this.removeInfoPanel()
    }
    this.setInfoPanel('level4-phone-info2')
    this.onPhoneComplete.dispatch()
    this.inactivePhoneBg.inputEnabled = false
  }
}
