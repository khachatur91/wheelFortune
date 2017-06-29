/**
 * Created by ashot on 6/16/17.
 */
import Phaser from 'phaser'

export default class QuizSummary extends Phaser.Group {
  constructor (game, correctAnswers, questions) {
    super(game)

    this.onQuizComplete = new Phaser.Signal()

    let inactiveBgGraphics = this.game.make.graphics()
    inactiveBgGraphics.beginFill(0)
    inactiveBgGraphics.drawRect(0, 0, game.world.width, game.world.height)
    inactiveBgGraphics.endFill()

    this.inactiveBg = this.game.add.sprite(0, 0, inactiveBgGraphics.generateTexture(), null, this)
    this.inactiveBg.alpha = 0.7
    this.inactiveBg.inputEnabled = true

    this.image = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'general-2', 'popup-bg-intro.png', this)
    this.image.anchor.setTo(0.5)

    this.light = this.game.add.image(947, 550, 'general-1', 'lights.png', this)
    this.light.anchor.setTo(0.5)

    this.topPanel = this.game.add.sprite(0, 150, 'general-1', 'top-panel.png', this)
    this.topPanel.position.x = (this.game.width - this.topPanel.width) / 2

    let correctPercentage = correctAnswers / questions
    let starsCount = 0
    if (correctPercentage === 1) {
      starsCount = 3
    } else if (correctPercentage > 0.6) {
      starsCount = 2
    } else if (correctPercentage > 0.2) {
      starsCount = 1
    }
    let frameName = ''
    for (let i = 0; i < 3; i++) {
      if (starsCount > i) {
        frameName = 'star.png'
      } else {
        frameName = 'star-empty.png'
      }
      let star = this.game.add.image(42 + i * 120, 25, 'general-1', frameName)
      this.topPanel.addChild(star)
    }

    window.localStorage.setItem('startsCount', starsCount)

    let outroText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'outro-text', null, this)
    outroText.anchor.setTo(0.5)
    let text = outroText.text
    text = text.replace('{correct}', correctAnswers.toString())
    text = text.replace('{total}', questions.toString())
    outroText.text = text
    outroText.fill = '#ffffff'
    outroText.font = 'PT Sans'
    outroText.fontSize = 35



    this.nextButton = this.game.add.sprite(this.game.world.centerX, 830, 'general-1', 'next-button.png', this)
    this.nextButton.anchor.setTo(0.5)
    this.nextButton.inputEnabled = true
    this.nextButton.events.onInputDown.add(this.dispatchQuizCompleteEvent, this)

    let hintButtonText = this.game.add.text(0, 0, 'nextButton', null, this)
    hintButtonText.anchor.setTo(0.5)
    hintButtonText.position.setTo(-5, -5)
    hintButtonText.fill = '#000099'
    hintButtonText.font = 'PT Sans'
    hintButtonText.fontSize = 35
    this.nextButton.addChild(hintButtonText)

    this.doctus = this.game.add.image(this.game.world.width, this.game.height - 184, 'general-2', 'doctus.png', this)
    this.doctus.anchor.y = 1

    let tween = this.game.add.tween(this.doctus)
    tween.to({x: 1300}, 700)
    tween.start()
  }

  dispatchQuizCompleteEvent () {
    this.onQuizComplete.dispatch(starsCount)
  }
}
