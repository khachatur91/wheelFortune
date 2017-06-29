/**
 * Created by khachatur on 6/29/17.
 */
import Phaser from 'phaser'
import ReelView from './ReelView'

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

  static START_REEL_RADIUS = 300
  static REEL_WIDTH = 100

  constructor (model) {
    super(window.game)

    this.reelViews = []
    this.stoppedRealsCounter = 0

    this.model = model
    this.model.onDataSet.add(this.onDataSetListener, this)
    this.model.onRotateStateChange.add(this.onRotateStateChangeListener, this)
    this.model.onPatternSet.add(this.onPatternSetListener, this)
  }

  onDataSetListener (reelsData) {
    let reelView
    let currentRadius = WheelView.START_REEL_RADIUS + reelsData.length * WheelView.REEL_WIDTH //biggest wheel radius
    for (let i = reelsData.length - 1; i >= 0; i--) {
      currentRadius -= WheelView.REEL_WIDTH
      reelView = new ReelView(this.game, reelsData[0], currentRadius, WheelView.COLORS[i])
      reelView.onStop.add(this.onReelRotationStop, this)
      this.reelViews.push(reelView)
      this.add(reelView)
    }
  }

  onRotateStateChangeListener (isStart) {
    if (isStart) {
      this.reelViews.forEach((reelView) => {
        reelView.startRotation()
      })
    }
    else {
      this.stoppedRealsCounter = 0
      this.reelViews.forEach((reelView) => {
        reelView.stopRotation()
      })
      this.startZoom()
      this.startRawShake()
    }
  }

  startRawShake () {
    this.reelViews.forEach((reelView) => {
      reelView.startItemShake()
    })
  }

  onReelRotationStop () {
    this.stoppedRealsCounter ++
    if (this.stoppedRealsCounter === this.reelViews.length) {
      this.model.setWheelRotateState(false)
    }
  }

  onPatternSetListener (patternArray) {
    for ( let i = 0, length = patternArray.length; i < length; i++) {
      this.reelViews[i].setDestinationIndex(patternArray[i])
    }
  }

  startZoom () {
    this.zoomTween = this.game.add.tween(this.scale)
    this.zoomTween.to({x: 1.7, y: 1.7}, 2000, null, true)
    this.positionTween = this.game.add.tween(this)
    this.positionTween.to({x: 2000}, 2000, null, true)
  }
}
