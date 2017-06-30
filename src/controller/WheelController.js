/**
 * Created by khachatur on 6/29/17.
 */
import WheelModel from '../model/WheelModel'

export default class WheelController {
  constructor (model) {
    this.model = model
  }

  setData (reelsData) {
    this.model.setReelsData(reelsData)
  }

  resetWheel () {
    this.model.resetWheel()
  }

  rotateWheel () {
    this.model.setWheelRotateState(WheelModel.WHEEL_START_STATE)
  }

  stopWheel () {
    this.model.setWheelRotateState(WheelModel.WHEEL_STOP_PROCESSING_STATE)
  }

  setPatternToRoll (patternArray) {
    this.model.setWheelRollPattern(patternArray)
  }
}
