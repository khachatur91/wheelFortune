/**
 * Created by ashot on 6/15/17.
 */
import Phaser from 'phaser'

export default class DoctusIntro extends Phaser.Group {
  constructor (game) {
    super(game)

    this.onNextClicked = new Phaser.Signal()

    this.inactiveBg = this.game.add.image(0, 0, 'general-1', 'simpleSquare.jpg')
    this.inactiveBg.width = this.game.world.width
    this.inactiveBg.height = this.game.world.height
    this.inactiveBg.alpha = 0.7
    this.inactiveBg.inputEnabled = true

    this.doctus = this.game.make.image(0, 0, 'general-2', 'doctus.png')
    this.infoBox = this.game.make.image(0, 0, 'general-1', 'doctus-info.png')

    this.container = this.game.add.group()
    this.container.x = this.game.world.width
    // this.container.y = this.game.world.height - this.doctus.height
    this.doctus.y = this.game.height - 184
    this.doctus.anchor.y = 1

    this.infoGroup = this.game.add.group()
    this.infoGroup.x = -300
    this.infoGroup.y = 200
    this.infoGroup.alpha = 0

    this.container.add(this.doctus)

    this.nextButton = this.game.add.sprite(0, 0, 'general-2', 'play-button.png')
    this.nextButton.inputEnabled = true
    this.nextButton.input.useHandCursor = true
    this.nextButton.events.onInputDown.add(this.onNextButtonClick.bind(this))

    let nextButtonText = this.game.add.text(0, 0, 'level3-doctus-nextButton', {fontSize: 30})
    nextButtonText.anchor.setTo(0.5)
    this.nextButton.anchor.setTo(0.5)
    this.nextButton.width = nextButtonText.width * 1.5

    this.nextButton.addChild(nextButtonText)

    this.infoGroup.add(this.infoBox)
    this.infoGroup.add(this.nextButton)

    this.nextButton.y = (this.infoGroup.height - (1.1 * this.nextButton.height))
    this.nextButton.x = 180
    this.container.add(this.infoGroup)

    this.tweenContainer()
  }

  tweenContainer () {
    let tweenContainer = this.game.add.tween(this.container).to({x: this.game.world.centerX}, 700, null, true)
    tweenContainer.onComplete.add(this.tweenInfoGroup.bind(this))
  }

  tweenInfoGroup () {
    this.game.add.tween(this.infoGroup).to({alpha: 1}, 300, null, true)
  }

  onNextButtonClick () {
    this.onNextClicked.dispatch()
  }
}
