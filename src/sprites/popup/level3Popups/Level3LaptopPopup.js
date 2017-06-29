/**
 * Created by ashot on 6/2/17.
 */
import Popup from '../Popup'
import Phaser from 'phaser'
export default class Level3LaptopPopup extends Popup {
  constructor (game) {
    super(game, 'atlas3-2', 'laptopZoom1.png')
    this.onLastLinkClick = new Phaser.Signal()

    let inactiveLaptopGraphics = this.game.make.graphics()
    inactiveLaptopGraphics.beginFill(0)
    inactiveLaptopGraphics.drawRect(0, 0, this.image.width, this.image.height)
    inactiveLaptopGraphics.endFill()

    this.inactiveLaptop = this.game.add.sprite(this.image.x, this.image.y, inactiveLaptopGraphics.generateTexture(), null, this)
    this.inactiveLaptop.alpha = 0
    this.inactiveLaptop.anchor.setTo(0.5)
    this.inactiveLaptop.inputEnabled = true

    this.link = this.game.add.sprite(700, 435, 'general-1', 'simpleSquare.jpg', this)
    this.link.width = 280
    this.link.height = 40
    this.link.alpha = 0
    this.link.inputEnabled = true
    this.link.events.onInputUp.addOnce(this.getLaptopPopup2, this)
    this.link.input.useHandCursor = true
  }

  getLaptopPopup2 () {
    this.link.destroy()
    this.changeImage('atlas3-2', 'laptopZoom2.png')
    this.link = this.game.add.sprite(830, 320, 'general-1', 'simpleSquare.jpg', this)
    this.link.width = 230
    this.link.height = 250
    this.link.alpha = 0
    this.link.inputEnabled = true
    this.link.events.onInputUp.addOnce(this.getLaptopPopup3, this)
    this.link.input.useHandCursor = true
  }
  getLaptopPopup3 () {
    this.onLastLinkClick.dispatch()
    this.link.destroy()
    this.changeImage('atlas3-3', 'laptopZoom3.png')
    this.inactiveLaptop.inputEnabled = false
  }
}
