/**
 * Created by khachatur on 6/29/17.
 */
import Phaser from 'phaser'

export default class WheelModel {
  constructor () {
    this.color = null
    this.onRotateStateChange = new Phaser.Signal()
    this.onStop = new Phaser.Signal()
    this.onDataSet = new Phaser.Signal()
    this.onPatternSet = new Phaser.Signal()
  }

  setReelsData (reelsData) {
    this.reelsData = reelsData
    this.onDataSet.dispatch(reelsData)
  }

  setWheelRollPattern (patternArray) {
    this.patternArray = patternArray
    this.onPatternSet.dispatch(patternArray)
  }

  setWheelRotateState (isRotating) {
    this.isRotating = isRotating
    this.onRotateStateChange.dispatch(isRotating)
  }


  setWheelRotateState (isRotating) {
    this.isRotating = isRotating
    this.onRotateStateChange.dispatch(isRotating)
  }
}
