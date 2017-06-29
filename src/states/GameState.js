/**
 * Created by khachatur on 6/29/17.
 */
import Phaser from 'phaser'
import WheelView from '../view/WheelView'
import WheelController from '../controller/WheelController'
import WheelModel from '../model/WheelModel'

export default class GameState extends Phaser.State {
  // TODO make static for custom Level state
  static STATE_IN_GAME = 0
  static STATE_LEVEL_COMPLETE = 1

  static PICK_ANIMATION_DURATION = 400

  init () {
    this.model = new WheelModel()
  }

  preload () {
  }

  create () {
    this.controller = new WheelController(this.model)
    this.view = new WheelView(this.model)
    this.view.scale.setTo(0.6)
    this.view.position.setTo(this.game.world.centerX, this.game.world.centerY)

    this.controller.setData(this.game.cache.getJSON('reelsData').reels)

    this.spinButton = this.game.add.button(200, 200, 'general', this.onSpinClick, this, 'button', 'button', 'button', 'button')
    this.spinButton.anchor.setTo(0.5)
    this.spinButtonLabel = this.game.add.text(0, 0, "SPIN", {fill: "#ffffff", fontSize: 30, align: 'center'})
    this.spinButtonLabel.anchor.setTo(0.5)
    this.spinButton.addChild(this.spinButtonLabel)
  }

  onSpinClick () {
    this.controller.setPatternToRoll([1,2,3,4,5])
    this.controller.rotateWheel()
  }
}
