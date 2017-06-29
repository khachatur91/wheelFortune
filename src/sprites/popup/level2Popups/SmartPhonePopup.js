/**
 * Created by ashot on 5/31/17.
 */
import Popup from '../Popup'
import Phaser from 'phaser'

export default class SmartPhonePopup extends Popup {
  constructor (game) {
    super(game, 'atlas2-3', 'cellphoneSearch.png')
    this.onEarthClick = new Phaser.Signal()

    this.image.y -= 50

    let grph = this.game.make.graphics()
    grph.beginFill(0)
    grph.drawRect(0, 0, 145, 50)
    grph.endFill()

    let txtr = grph.generateTexture()
    this.searchButton = this.game.add.sprite(830, 205, txtr, null, this)
    this.searchButton.alpha = 0
    this.searchButton.inputEnabled = true
    this.searchButton.events.onInputUp.add(this.onSearchButtonClick, this)

    this.earthButton = this.game.add.sprite(985, 205, txtr, null, this)
    this.earthButton.alpha = 0
    this.earthButton.inputEnabled = true
    this.earthButton.events.onInputUp.add(this.onEarthButtonClick, this)

    this.isSearchTab = true
  }

  onSearchButtonClick () {
    if (!this.isSearchTab) {
      this.changeImage('atlas2-3', 'cellphoneSearch.png')
      this.image.y -= 50

      this.isSearchTab = true

      this.removeInfoPanel()
    }
  }

  onEarthButtonClick () {
    if (this.isSearchTab) {
      this.isSearchTab = false

      this.changeImage('atlas2-3', 'cellphoneEarth.png')
      this.image.y -= 50

      this.onEarthClick.dispatch()

      this.setInfoPanel('level2-info-google-earth')
    }
  }
}
