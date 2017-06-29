/**
 * Created by ashot on 6/2/17.
 */
import Popup from '../Popup'
import Phaser from 'phaser'
export default class Level4LaptopPopup extends Popup {
  constructor (game) {
    super(game, 'atlas4-1', 'laptopZoom1.png')
    this.onLastLinkClick = new Phaser.Signal()

    let inactiveLaptopGraphics = this.game.make.graphics()
    inactiveLaptopGraphics.beginFill(0)
    inactiveLaptopGraphics.drawRect(0, 0, this.image.width, this.image.height)
    inactiveLaptopGraphics.endFill()

    this.inactiveLaptop = this.game.add.sprite(this.image.x, this.image.y, inactiveLaptopGraphics.generateTexture(), null, this)
    this.inactiveLaptop.alpha = 0
    this.inactiveLaptop.anchor.setTo(0.5)
    this.inactiveLaptop.inputEnabled = true

    this.link = this.game.add.sprite(890, 453, 'general-1', 'simpleSquare.jpg', this)
    this.link.width = 70
    this.link.height = 22
    this.link.alpha = 0
    this.link.inputEnabled = true
    this.link.events.onInputUp.addOnce(this.getLaptopPopup2, this)
    this.link.input.useHandCursor = true
  }

  getLaptopPopup2 () {
    this.link.destroy()
    this.changeImage('atlas4-2', 'laptopZoom2.png')
    this.link = this.game.add.sprite(790, 410, 'general-1', 'simpleSquare.jpg', this)
    this.link.width = 70
    this.link.height = 70
    this.link.alpha = 0
    this.link.inputEnabled = true
    this.link.events.onInputUp.addOnce(this.getLaptopPopup3, this)
    this.link.input.useHandCursor = true
  }

  getLaptopPopup3 () {
    this.link.destroy()
    this.changeImage('atlas4-2', 'laptopZoom3.png')
    this.link = this.game.add.sprite(1100, 230, 'general-1', 'simpleSquare.jpg', this)
    this.link.width = 250
    this.link.height = 380
    this.link.alpha = 0.5
    this.link.inputEnabled = true
    this.link.events.onInputUp.addOnce(this.getLaptopPopup4, this)
    this.link.input.useHandCursor = true
  }

  getLaptopPopup4 () {
    this.onLastLinkClick.dispatch()
    this.link.destroy()
    this.changeImage('atlas4-3', 'laptopZoom4.png')
    this.inactiveLaptop.inputEnabled = false
  }
}
