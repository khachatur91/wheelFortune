/**
 * Created by khachatur on 6/29/17.
 */

export default class WheelController {
  constructor (model) {

    this.model = model
    this.model.onRotateStateChange.add(this.onRotateStateChangeListener, this)
  }

  setData (reelsData) {
    this.model.setReelsData(reelsData)
  }

  rotateWheel () {
    this.model.setWheelRotateState(true)
  }

  onRotateStateChangeListener (isStart) {
    if (!isStart) {
      console.log("Wheel Stopped")
    }
  }

  setPatternToRoll (patternArray) {
    this.model.setWheelRollPattern(patternArray)
  }
}
