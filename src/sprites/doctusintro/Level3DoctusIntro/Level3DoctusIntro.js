/**
 * Created by ashot on 6/16/17.
 */
import DoctusIntro from '../DoctusIntro'

export default class Level3DoctusIntro extends DoctusIntro {
  constructor (game) {
    super(game)

    this.infoTextHeader = this.game.add.text(20, 15, 'level3-doctus-infoTextHeader', {fontSize: 30, fill: '#3b2902'}, this.infoGroup)
    this.infoTextHeader.wordWrap = true
    this.infoTextHeader.wordWrapWidth = 300

    this.infoTextBody = this.game.add.text(20, 80, 'level3-doctus-infoTextBody', {fontSize: 25, fill: '#3b2902'}, this.infoGroup)
    this.infoTextBody.wordWrap = true
    this.infoTextBody.wordWrapWidth = 300
  }

  onNextButtonClick () {
    let tweenInactiveBg = this.game.add.tween(this.inactiveBg).to({alpha: 0}, 250, null, true)
    tweenInactiveBg.onComplete.add(function () {
      this.inactiveBg.destroy()
      this.inactiveBg = null
    }, this)
    let tweenContainer = this.game.add.tween(this.container).to({alpha: 0}, 300, null, true)
    tweenContainer.onComplete.add(this.onTweenContainerComplete, this)
  }

  onTweenContainerComplete () {
    this.container.destroy()
    this.container = null
    super.onNextButtonClick()
  }
}
