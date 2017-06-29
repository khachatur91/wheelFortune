/**
 * Created by khachatur on 5/18/17.
 */
import Phaser from 'phaser'

export default class IntroPopup extends Phaser.Group {
  constructor (game, levelIndex) {
    super(game)

    this.levelIndex = levelIndex
    this.onPlay = new Phaser.Signal()
    this.onClose = new Phaser.Signal()

    let inactiveBgGraphics = this.game.make.graphics()
    inactiveBgGraphics.beginFill(0)
    inactiveBgGraphics.drawRect(0, 0, game.world.width, game.world.height)
    inactiveBgGraphics.endFill()

    this.inactiveBg = this.game.add.sprite(0, 0, inactiveBgGraphics.generateTexture(), null, this)
    this.inactiveBg.alpha = 0.7
    this.inactiveBg.inputEnabled = true

    this.image = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'general-2', 'popup-bg-intro.png', this)
    this.image.anchor.setTo(0.5)

    this.preview = this.game.add.image(this.game.world.centerX, 410, 'levelPreview', 'preview' + levelIndex + '.png', this)
    this.preview.anchor.setTo(0.5)

    this.topPanel = this.game.add.sprite(0, 150, 'general-1', 'top-panel.png', this)
    this.topPanel.position.x = (this.game.width - this.topPanel.width) / 2
    let levelTitle = this.game.add.text(215, 70, 'level-title', null, this)
    levelTitle.text += levelIndex
    levelTitle.anchor.setTo(0.5)
    levelTitle.fill = '#ffbd2c'
    levelTitle.stroke = '#8f4c16'
    levelTitle.strokeThickness = 10
    levelTitle.font = 'PT Sans'
    levelTitle.fontSize = 70
    this.topPanel.addChild(levelTitle)

    let introText = this.game.add.text(670, 555, 'level' + levelIndex + '-intro', null, this)
    introText.wordWrap = true
    introText.fill = '#fec547'
    introText.fontSize = 22
    introText.wordWrapWidth = this.image.width * 0.75
    console.log(introText.text)

    this.playButton = this.game.add.sprite(this.game.world.centerX, 830, 'general-2', 'play-button.png', this)
    this.playButton.anchor.setTo(0.5)
    this.playButton.inputEnabled = true
    this.playButton.events.onInputDown.add(this.playClickListener, this)

    this.closeButton = this.game.add.sprite(1330, 210, 'general-1', 'closeButton.png', this)
    this.closeButton.anchor.setTo(0.5)
    this.closeButton.inputEnabled = true
    this.closeButton.events.onInputDown.add(this.closeClickListener, this)

    let hintButtonText = this.game.add.text(0, 0, 'playButton', null, this)
    hintButtonText.anchor.setTo(0.5)
    hintButtonText.position.setTo(-5, -5)
    hintButtonText.fill = '#95663e'
    hintButtonText.font = 'PT Sans'
    hintButtonText.fontSize = 35
    this.playButton.addChild(hintButtonText)
  }

  playClickListener () {
    this.onPlay.dispatch(this.levelIndex)
  }

  closeClickListener () {
    this.onClose.dispatch()
  }
}
