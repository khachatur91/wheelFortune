/**
 * Created by khachatur on 6/29/17.
 */
import Phaser from 'phaser'

export default class WheelModel {
  static WHEEL_STOP_STATE = 1
  static WHEEL_START_STATE = 2
  static WHEEL_STOP_PROCESSING_STATE = 3

  constructor () {
    this.color = null
    this.onRotateStateChange = new Phaser.Signal()
    this.onStop = new Phaser.Signal()
    this.onDataSet = new Phaser.Signal()
    this.onPatternSet = new Phaser.Signal()
    this.onReset = new Phaser.Signal()
    this.onWheelSpeedMax = new Phaser.Signal()
  }

  setReelsData (reelsData) {
    this.reelsData = reelsData
    this.onDataSet.dispatch(reelsData)
  }

  resetWheel () {
    this.patternArray = null
    this.onReset.dispatch()
  }

  setWheelRollPattern (patternArray) {
    this.patternArray = patternArray
    this.onPatternSet.dispatch(patternArray)
  }

  setWheelSpeedOnMax (isMax) {
    this.isMax = isMax
    this.onWheelSpeedMax.dispatch(isMax)
  }

  setWheelRotateState (rotationState) {
    this.rotationState = rotationState
    this.onRotateStateChange.dispatch(rotationState)
  }
}
