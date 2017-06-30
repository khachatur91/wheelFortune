/**
 * Created by khachatur on 6/29/17.
 */
import Phaser from 'phaser'
import WheelView from '../view/WheelView'
import WheelController from '../controller/WheelController'
import WheelModel from '../model/WheelModel'
import AudioManager from '../AudioManager';
import ItemView from "../view/ItemView";

export default class GameState extends Phaser.State {
  // TODO make static for custom Level state
  static STATE_IN_GAME = 0
  static STATE_LEVEL_COMPLETE = 1

  static PICK_ANIMATION_DURATION = 400

  init () {

    this.stage.backgroundColor = '#1b1a23'

    this.model = new WheelModel()

    this.model.onRotateStateChange.add(this.onRotateStateChangeListener, this)
    this.model.onWheelSpeedMax.add(this.onWheelSpeedMaxListener, this)

    this.audioManager = AudioManager.instance
    this.b = 0
    this.frames = []
    this.start = false
    this.sprite = null

    this.playButtonActiveFrame = 'playButtonActive'
    this.playButtonDeactivateFrame = 'playButtonDeactivate'
    this.stopButtonActiveFrame = 'stopButtonActive'
    this.stopButtonDeactivateFrame = 'stopButtonDeactivate'
  }

  onWheelSpeedMaxListener (isMax) {
    if (isMax) {
      this.setStopButtonInput(true)
    }
  }

  onRotateStateChangeListener (wheelState) {
    switch (wheelState) {
      case WheelModel.WHEEL_START_STATE:
        this.isRolling = true
        for (var i = 0; i < this.framesForBlur; i++) {
          this.frames.push(this.game.make.bitmapData(this.game.width, this.game.height))
        }
        break
      case WheelModel.WHEEL_STOP_STATE:
        this.isRolling = false
        this.frames.length = 0
        this.audioManager.play('revealSFX')
        // this.game.time.events.add(4000, this.resetWheel, this)
        this.showColorContainer()
        break
      case WheelModel.WHEEL_STOP_PROCESSING_STATE:
        break
    }
  }

  createItemClones (items) {
    for (let i = 0; i < items.length; i++) {
      let rawGridItems = items[i]
      for (let j = 0; j < rawGridItems.length; j++) {
        let item = new ItemView(this.game, rawGridItems[j].frame)
        item.visible = false
        item.position.setTo(rawGridItems[j].x, rawGridItems[j].y)
        this.game.add.existing(item)

        item.tweenTo(720 + 60 * j, 120 + 40 * i)
      }
    }
  }

  preload () {
  }

  create () {
    this.controller = new WheelController(this.model)
    this.view = new WheelView(this.model)
    this.view.position.setTo(this.game.world.centerX, this.game.world.centerY)

    this.controller.setData(this.game.cache.getJSON('reelsData').reels)

    this.framesForBlur = 6

    this.overlayBg = this.game.add.image(0, 0, 'general', 'bg')

    let buttonsPadding = 300
    this.playButton = this.game.add.button(0, this.game.world.centerY, 'general', this.onPlayClick, this, this.playButtonActiveFrame, this.playButtonActiveFrame, this.playButtonActiveFrame, this.playButtonActiveFrame)
    this.playButton.anchor.setTo(0.5)
    this.playButton.position.x = buttonsPadding
    // this.spinButtonLabel = this.game.add.text(0, 0, 'SPIN', {fill: '#ffffff', fontSize: 30, align: 'center'})
    // this.spinButtonLabel.anchor.setTo(0.5)
    // this.spinButton.addChild(this.spinButtonLabel)

    this.stopButton = this.game.add.button(0, this.game.world.centerY, 'general', this.onStopClick, this, this.stopButtonDeactivateFrame, this.stopButtonDeactivateFrame, this.stopButtonDeactivateFrame, this.stopButtonDeactivateFrame)
    this.stopButton.anchor.setTo(0.5)
    this.stopButton.position.x = this.game.width - buttonsPadding
    this.stopButton.inputEnabled = false
    // this.spinButtonLabel = this.game.add.text(0, 0, 'STOP', {fill: '#ffffff', fontSize: 30, align: 'center'})
    // this.spinButtonLabel.anchor.setTo(0.5)
    // this.spinButton.addChild(this.spinButtonLabel)


    this.colorContainer = this.game.add.image(this.game.world.centerX, 0, 'general', 'popup')
    this.colorContainer.anchor.setTo(0.5, 1)
    this.colorContainer.visible = false
    this.colorContainer.scale.setTo(0)
    this.colorContainer.alpha = 0
  }

  onPlayClick () {
    this.setPlayButtonInput(false)

    this.audioManager.play('spinSFX')
    this.controller.setPatternToRoll([1, 2, 3, 4, 5])
    this.controller.rotateWheel()
  }

  onStopClick () {
    this.controller.stopWheel()
    this.setStopButtonInput(false)
  }

  setStopButtonInput (isEnabled) {
    if (isEnabled) {
      this.stopButton.setFrames(this.stopButtonActiveFrame, this.stopButtonActiveFrame, this.stopButtonActiveFrame, this.stopButtonActiveFrame)
      this.stopButton.inputEnabled = true
    }
    else {
      this.stopButton.setFrames(this.stopButtonDeactivateFrame, this.stopButtonDeactivateFrame, this.stopButtonDeactivateFrame, this.stopButtonDeactivateFrame)
      this.stopButton.inputEnabled = false
    }
  }

  setPlayButtonInput (isEnabled) {
    if (isEnabled) {
      this.playButton.setFrames(this.playButtonActiveFrame, this.playButtonActiveFrame, this.playButtonActiveFrame, this.playButtonActiveFrame)
      this.playButton.inputEnabled = true
    }
    else {
      this.playButton.setFrames(this.playButtonDeactivateFrame, this.playButtonDeactivateFrame, this.playButtonDeactivateFrame, this.playButtonDeactivateFrame)
      this.playButton.inputEnabled = false
    }
  }

  showColorContainer () {
    this.colorContainer.visible = true
    let tween = this.game.add.tween(this.colorContainer)
    let scaleTween = this.game.add.tween(this.colorContainer.scale)
    scaleTween.to({x: 1, y: 1}, 1000, Phaser.Easing.Quadratic.Out, true)
    tween.to({y: 400, alpha: 1}, 1000, Phaser.Easing.Quadratic.Out, true)
    tween.onComplete.add(this.onPopupShowListener, this)
  }

  preRender () {
    if (this.isRolling) {
      this.frames[this.b].cls()
      this.frames[this.b].copyRect(
        this.game.canvas, this.world.bounds, 0, 0, 0.1
      )
      this.b++
      if (this.b === this.framesForBlur) {
        this.start = true
        this.b = 0
      }
    }
  }

  render () {
    if (this.isRolling) {
      for (let i = 0; i < this.framesForBlur; i++) {
        this.game.context.drawImage(this.frames[i].canvas, 0, 0)
      }
    }
  }

  resetWheel () {
    this.controller.resetWheel()
  }

  onPopupShowListener () {
    this.createItemClones(this.view.getGridItems())
  }
}
