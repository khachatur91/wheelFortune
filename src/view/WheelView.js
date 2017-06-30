/**
 * Created by khachatur on 6/29/17.
 */
import Phaser from 'phaser'
import ReelView from './ReelView'
import WheelModel from '../model/WheelModel'

export default class WheelView extends Phaser.Group {
  static COLORS = [
    0xff9900,
    0xff8800,
    0xff7700,
    0xff6600,
    0xff5500,
    0xff4400,
    0xff3300,
    0xff2200,
    0xff1100,
    0xff0000
  ]

  static START_REEL_RADIUS = 130
  static REEL_WIDTH = 40

  constructor (model) {
    super(window.game)

    this.reelViews = []
    this.gridItems = [[], [], []]
    this.stoppedRealsCounter = 0
    this.maxSpeedReachReelsCounter = 0

    this.model = model
    this.model.onDataSet.add(this.onDataSetListener, this)
    this.model.onRotateStateChange.add(this.onRotateStateChangeListener, this)
    this.model.onPatternSet.add(this.onPatternSetListener, this)
    // this.model.onReset.add(this.startZoomOut, this)
  }

  onDataSetListener (reelsData) {
    let reelView
    let currentRadius = WheelView.START_REEL_RADIUS + reelsData.length * WheelView.REEL_WIDTH // biggest wheel radius
    for (let i = reelsData.length - 1; i >= 0; i--) {
      currentRadius -= WheelView.REEL_WIDTH
      reelView = new ReelView(this.game, reelsData[0], currentRadius, WheelView.COLORS[i])
      reelView.onStop.add(this.onReelRotationStopListener, this)
      reelView.onMaxSpeed.add(this.onReelMaxSpeedListener, this)
      this.reelViews.push(reelView)
      this.add(reelView)
    }
    this.transparentOverlay = this.game.add.image(0, 0, 'general', 'transparentOverlay', this)
    this.transparentOverlay.anchor.setTo(0.5)
  }

  onRotateStateChangeListener (rotateState) {
    switch (rotateState) {
      case WheelModel.WHEEL_START_STATE:
        this.reelViews.forEach((reelView) => {
          reelView.startRotation()
        })
        break
      case WheelModel.WHEEL_STOP_STATE:
        this.stoppedRealsCounter = 0
        // this.startZoomIn()
        this.startRawShake()
        break
      case WheelModel.WHEEL_STOP_PROCESSING_STATE:
        this.reelViews.forEach((reelView) => {
          reelView.stopRotation()
        })
        this.maxSpeedReachReelsCounter = 0
        break
    }
  }

  startRawShake () {
    this.reelViews.forEach((reelView) => {
      reelView.startItemShake()
    })
  }

  onReelRotationStopListener () {
    this.stoppedRealsCounter ++
    if (this.stoppedRealsCounter === this.reelViews.length) {
      this.model.setWheelRotateState(WheelModel.WHEEL_STOP_STATE)
    }
  }

  onReelMaxSpeedListener () {
    this.maxSpeedReachReelsCounter ++
    if (this.maxSpeedReachReelsCounter === this.reelViews.length) {
      this.model.setWheelSpeedOnMax(true)
    }
  }

  onPatternSetListener (patternArray) {
    for (let i = 0, length = this.reelViews.length; i < length; i++) {
      this.reelViews[i].setDestinationIndex(patternArray[i])
    }
  }

  startZoomIn () {
    this.originPosition = {x: this.position.x, y: this.position.y}
    this.originScale = {x: this.scale.x, y: this.scale.y}
    let toScale = 1.4
    this.zoomTween = this.game.add.tween(this.scale)
    this.zoomTween.to({x: toScale, y: toScale}, 2000, null, true, 1000)
    this.positionTween = this.game.add.tween(this)
    this.positionTween.to({x: 1200}, 2000, null, true, 1000)
  }

  getGridItems () {
    for (let i = 0; i < this.reelViews.length; i++) {
      let reelGridItems = this.reelViews[i].getRawItems()
      for (let j = 0; j < reelGridItems.length; j++) {
        this.gridItems[j][i] = {x: reelGridItems[j].worldPosition.x, y: reelGridItems[j].worldPosition.y, frame: reelGridItems[j].frameName}
      }
    }
    return this.gridItems
  }

  startZoomOut () {
    // set default values if they are undefined
    let toScale = this.originScale || {x: 1, y: 1}
    let toPosition = this.originPosition || {x: 0, y: 0}
    this.zoomTween = this.game.add.tween(this.scale)
    this.zoomTween.to({x: toScale.x, y: toScale.y}, 2000, null, true)
    this.positionTween = this.game.add.tween(this)
    this.positionTween.to({x: toPosition.x}, 2000, null, true)
  }
}
