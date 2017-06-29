/**
 * Created by khachatur on 4/26/17.
 */
import Phaser from 'phaser'
import Popup from '../Popup'
import { centerGameObjects } from '../../../utils'

export default class LaboratoryPopup extends Popup {
  constructor (game, isButtonActive) {
    super(game, 'atlas2-1', 'laboratory/laboratoryBg.png')

    this.image.anchor.setTo(0)
    this.image.position.setTo(0)
    this.image.inputEnabled = isButtonActive

    if (!isButtonActive) {
      this.setInfoPanel('level2-info-lab1')
    } else {
      this.setInfoPanel('level2-info-lab2')
    }

    this.laboratoryCompleteEvent = new Phaser.Signal()

    this.image.anchor.setTo(0)
    this.image.position.setTo(0)
    this.image.inputEnabled = isButtonActive

    this.fireOnButton1 = this.game.add.sprite(730, 570, 'general-1', 'simpleSquare.jpg', this)
    this.fireOnButton1.width = 60
    this.fireOnButton1.height = 60
    this.fireOnButton1.alpha = 0
    this.fireOnButton1.inputEnabled = isButtonActive
    this.fireOnButton1.events.onInputUp.add(this.fireOnListener, this)

    this.fireOnButton2 = this.game.add.image(1270, 280, 'atlas2-1', 'laboratory/valve.png', this)
    this.fireOnButton2.inputEnabled = isButtonActive
    this.fireOnButton2.events.onInputUp.add(this.step2Listener, this)
    centerGameObjects([this.fireOnButton1, this.fireOnButton2])

    this.gloves = this.game.add.sprite(170, 5, 'atlas2-2', 'laboratory/glove.png', this)
    this.gloves.inputEnabled = isButtonActive
    this.gloves.events.onInputUp.addOnce(this.takeGloves, this)

    this.glasses = this.game.add.image(1550, 20, 'atlas2-1', 'laboratory/glasses.png', this)
    this.glasses.inputEnabled = isButtonActive
    this.glasses.events.onInputUp.addOnce(this.takeGlasses, this)

    this.fireImg = this.game.add.image(685, 460, 'atlas2-1', 'laboratory/fire.png', this)
    this.fireImg.alpha = 0
    this.kolbImg = this.game.add.image(625, 120, 'atlas2-3', 'laboratory/kolb.png', this)
    this.kolbImg.alpha = 0
    this.greenImg = this.game.add.image(790, 290, 'atlas2-1', 'laboratory/green.png', this)
    this.greenImg.alpha = 0
    this.yellowImg = this.game.add.image(902, 238, 'atlas2-1', 'laboratory/yellow.png', this)
    this.yellowImg.alpha = 0
    this.violetImg = this.game.add.image(1213, 132, 'atlas2-1', 'laboratory/violet.png', this)
    this.violetImg.alpha = 0
    this.blueImg = this.game.add.image(1195, 385, 'atlas2-1', 'laboratory/blue.png', this)
    this.blueImg.alpha = 0

    this.game.add.image(0, 0, 'atlas2-2', 'laboratory/lights.png', this)
  }

  takeGloves () {
    this.gloves.destroy()
    this.isGlovesTaken = true
  }

  takeGlasses () {
    this.glasses.destroy()
    this.isGlassesTaken = true
  }
  fireOnListener () {
    if (!this.isGlovesTaken || !this.isGlassesTaken) {
      return
    }
    this.fireOnButton1.events.onInputUp.remove(this.fireOnListener, this)
    this.isButton1Clicked = true
    this.tween = this.game.add.tween(this.fireImg)
    this.tween.to({'alpha': 1}, this.tweenDuration)
    this.tween.onComplete.add(this.tweenKolb, this)
    this.tween.start()
  }

  tweenKolb () {
    this.tween = this.game.add.tween(this.kolbImg)
    this.tween.to({'alpha': 1}, this.tweenDuration)
    this.tween.onComplete.add(this.tweenGreen, this)
    this.tween.start()
  }

  tweenGreen () {
    this.tween = this.game.add.tween(this.greenImg)
    this.tween.to({'alpha': 1}, this.tweenDuration)
    this.tween.onComplete.add(this.tweenYellow, this)
    this.tween.start()
  }

  tweenYellow () {
    this.tween = this.game.add.tween(this.yellowImg)
    this.tween.to({'alpha': 1}, this.tweenDuration)
    this.tween.start()
  }

  tweenViolet () {
    this.tween = this.game.add.tween(this.violetImg)
    this.tween.to({'alpha': 1}, this.tweenDuration)
    this.tween.onComplete.add(this.tweenBlue, this)
    this.tween.start()
  }

  tweenBlue () {
    this.tween = this.game.add.tween(this.blueImg)
    this.tween.to({'alpha': 1}, this.tweenDuration)
    this.tween.onComplete.add(this.finishListener, this)
    this.tween.start()
  }

  finishListener () {
    this.game.time.events.add(Phaser.Timer.SECOND, this.dispatchCompleteEvent, this)
  }

  dispatchCompleteEvent () {
    this.setInfoPanel('level2-info-lab3')

    this.image.inputEnabled = false
    this.laboratoryCompleteEvent.dispatch()
  }

  step2Listener () {
    if (this.isButton1Clicked) {
      this.tweenViolet()
      this.fireOnButton2.events.onInputUp.remove(this.step2Listener, this)
      this.game.add.tween(this.fireOnButton2).to({ angle: -45 }, 800, Phaser.Easing.Linear.None, true)
      this.bringToTop(this.fireOnButton2)
    }
  }
}
