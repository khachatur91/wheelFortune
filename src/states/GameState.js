/**
 * Created by khachatur on 6/29/17.
 */
import Phaser from 'phaser'
import WheelView from '../view/WheelView'
import WheelController from '../controller/WheelController'
import WheelModel from '../model/WheelModel'
import AudioManager from '../AudioManager';
import ItemView from '../view/ItemView';

export default class GameState extends Phaser.State {
  // TODO make static for custom Level state
  static STATE_IN_GAME = 0
  static STATE_LEVEL_COMPLETE = 1

  static PICK_ANIMATION_DURATION = 400

  init () {
    this.stage.backgroundColor = '#1b1a23'

    this.resultPatterns = this.game.cache.getJSON('resultPatterns').patterns
    this.model = new WheelModel()

    this.audioManager = AudioManager.instance
    this.frameIndex = 0
    this.frames = []
    this.start = false
    this.sprite = null

    this.playButtonActiveFrame = 'playButtonActive'
    this.playButtonDeactivateFrame = 'playButtonDeactivate'
    this.stopButtonActiveFrame = 'stopButtonActive'
    this.stopButtonDeactivateFrame = 'stopButtonDeactivate'
  }

  onWheelSpeedMaxListener () {
    this.setStopButtonInput(true)
  }

  onWheelStoppedListener () {
    this.isRolling = false
    this.frames.length = 0
    this.audioManager.play('revealSFX')
    this.showColorContainer()
  }

  createItemClones (items) {
    this.itemsCounter = 0
    for (let i = 0; i < items.length; i++) {
      let rawGridItems = items[i]
      for (let j = 0; j < rawGridItems.length; j++) {
        let item = new ItemView(this.game, rawGridItems[j].frame)
        item.visible = false
        item.position.setTo(rawGridItems[j].x, rawGridItems[j].y)
        this.game.add.existing(item)

        item.tweenTo(this.colorContainer.x - this.colorContainer.width / 2 + 150 + 105 * j,
          this.colorContainer.y + 125 + 72 * i, this.onItemTweenComplete.bind(this, item))
      }
    }
  }

  onItemTweenComplete (item) {
    item.position.x -= this.colorContainer.x
    item.position.y -= this.colorContainer.y
    this.colorContainer.addChild(item)
    this.itemsCounter ++
    if (this.itemsCounter === 15) {
      let tween = this.game.add.tween(this.colorContainer.scale)
      tween.to({x: 1.5, y: 1.5}, 1000).start()
      tween.onComplete.add(this.onPopupZoomComplete, this)
    }
  }

  showColorContainer () {
    this.colorContainer.visible = true
    let tween = this.game.add.tween(this.colorContainer)
    let scaleTween = this.game.add.tween(this.colorContainer.scale)
    scaleTween.to({x: 1, y: 1}, 1000, Phaser.Easing.Quadratic.Out, true)
    tween.to({y: 100, alpha: 1}, 1000, Phaser.Easing.Quadratic.Out, true)
    tween.onComplete.add(this.onPopupShowListener, this)
  }

  onPopupShowListener () {
    this.createItemClones(this.view.getGridItems())
  }

  onPopupZoomComplete () {
    let tween = this.game.add.tween(this.colorContainer)
    let scaleTween = this.game.add.tween(this.colorContainer.scale)
    scaleTween.to({x: 0, y: 0}, 1000, Phaser.Easing.Quadratic.Out, true, 2000)
    tween.to({y: -300, alpha: 0}, 1000, Phaser.Easing.Quadratic.Out, true, 2000)
    tween.onComplete.add(this.onPopupHideComplete, this)
  }

  onPopupHideComplete () {
    this.colorContainer.removeChildren()
    this.colorContainer.visible = false

    this.setResultPattern()
    this.setPlayButtonInput(true)
  }

  setResultPattern () {
    let randomPatternIndex = this.game.rnd.integerInRange(0, this.resultPatterns.length - 1)
    this.controller.setPatternToRoll(this.resultPatterns[randomPatternIndex])
  }

  create () {
    this.controller = new WheelController(this.model)
    this.controller.onWheelStop.add(this.onWheelStoppedListener, this)
    this.controller.onWheelReachMaxSpeed.add(this.onWheelSpeedMaxListener, this)

    this.view = new WheelView(this.model)
    this.view.position.setTo(this.game.world.centerX, this.game.world.centerY)

    this.controller.setData(this.game.cache.getJSON('reelsData').reels)
    this.setResultPattern()

    this.framesForBlur = 6

    this.game.add.image(0, 0, 'general', 'bg')

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
    this.colorContainer.anchor.setTo(0.5, 0)
    this.colorContainer.visible = false
    this.colorContainer.scale.setTo(0)
    this.colorContainer.alpha = 0
  }

  onPlayClick () {
    this.setPlayButtonInput(false)
    this.controller.rotateWheel()

    this.isRolling = true
    for (var i = 0; i < this.framesForBlur; i++) {
      this.frames.push(this.game.make.bitmapData(this.game.width, this.game.height))
    }
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

  preRender () {
    if (this.isRolling) {
      this.frames[this.frameIndex].cls()
      this.frames[this.frameIndex].copyRect(
        this.game.canvas, this.world.bounds, 0, 0, 0.1
      )
      this.frameIndex++
      if (this.frameIndex === this.framesForBlur) {
        this.start = true
        this.frameIndex = 0
      }
    }
  }

  render () {
    if (this.isRolling && this.start) {
      for (let i = 0; i < this.framesForBlur; i++) {
        this.game.context.drawImage(this.frames[i].canvas, 0, 0)
      }
    }
  }
}
