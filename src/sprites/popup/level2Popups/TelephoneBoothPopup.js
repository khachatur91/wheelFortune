/**
 * Created by khachatur on 4/26/17.
 */
import Phaser from 'phaser'
import Popup from '../Popup'

export default class TelephoneBoothPopup extends Popup {
  constructor (game, hasCoin, isStroked) {
    super(game, 'atlas2-2', 'phoneZoom.png')

    if (isStroked) {
      this.setInfoPanel('level2-info-phone4')
      return
    }

    this.setInfoPanel(hasCoin ? 'level2-info-phone2' : 'level2-info-phone1')
    this.image.inputEnabled = true

    this.onPutCoin = new Phaser.Signal()

    this.coinInitialX = 100
    this.coinInitialY = 160

    if (hasCoin) {
      this.coinItem = this.game.add.sprite(100, 160, 'atlas2-1', 'coin.png', this)
      this.coinItem.anchor.setTo(0.5)
      this.coinItem.inputEnabled = true
      this.coinItem.input.enableDrag(true)
      this.coinItem.events.onDragStop.add(this.onDragStop, this)
      this.coinItem.events.onDragUpdate.add(this.onDragUpdate, this)
    }

    this.coinBtn = this.game.add.sprite(1317, 160, 'general-1', 'simpleSquare.jpg', this)
    this.coinBtn.width = 60
    this.coinBtn.height = 90
    this.coinBtn.alpha = 0
  }

  putCoin () {
    this.image.inputEnabled = false
    this.infoText.text = 'level2-info-phone3'
    this.coinItem.destroy()
    this.onPutCoin.dispatch()
    this.isCallPhase = true
  }

  closeHandler () {
    if (this.isCallPhase) {
      this.isCallPhase = false
      this.infoText.text = 'level2-info-phone4'
    } else {
      super.closeHandler()
    }
  }

  onDragStop () {
    if (this.checkOverlap(this.coinItem, this.coinBtn)) {
      this.putCoin()
    } else {
      this.coinItem.frameName = 'coin.png'
      this.coinItem.inputEnabled = false
      this.coinItem.input.enableDrag(false)
      let tween = this.game.add.tween(this.coinItem)
      tween.to({x: this.coinInitialX, y: this.coinInitialY}, 100)
      tween.onComplete.add(this.enableCoinDrag, this)
      tween.start()
    }
  }

  onDragUpdate () {
    if (this.checkOverlap(this.coinItem, this.coinBtn)) {
      this.coinItem.frameName = 'coinDrop.png'
    } else {
      this.coinItem.frameName = 'coin.png'
    }
  }

  enableCoinDrag () {
    this.coinItem.inputEnabled = true
    this.coinItem.input.enableDrag(true)
  }

  checkOverlap (spriteA, spriteB) {
    let boundsA = spriteA.getBounds()
    let boundsB = spriteB.getBounds()

    return Phaser.Rectangle.intersects(boundsA, boundsB)
  }
}
