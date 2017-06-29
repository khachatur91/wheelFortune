/**
 * Created by khachatur on 4/26/17.
 */
/**
 * Created by khachatur on 4/26/17.
 */
import Phaser from 'phaser'
import PhaserNineSlice from '@orange-games/phaser-nineslice'

export default class QuestionView extends Phaser.Group {
  constructor (game, question) {
    super(game)

    this.questionAnsweredEvent = new Phaser.Signal()
    this.questionData = question
    this.questionLabel = this.game.add.text(this.game.world.centerX, 0, question.question, {'fill': '#ffffff'}, this)
    this.questionLabel.font = 'Bangers'
    this.questionLabel.anchor.x = 0.5
    this.questionLabel.wordWrap = true
    this.questionLabel.wordWrapWidth = 600
    this.questionLabel.padding.set(5, 5)
    this.questionLabel.fontSize = 30

    this.layoutAnswers()
    this.isAnsweredCorrect = true
  }

  layoutAnswers () {
    this.answers = []
    let nextPositionY = 120
    let gap = 15
    for (let i = 0; i < this.questionData.answers.length; i++) {
      let group = this.game.add.group(this)

      let answerText = this.game.add.text(0, 0, this.questionData.answers[i], {'fill': '#ffffff'}, this)
      answerText.wordWrap = true
      answerText.wordWrapWidth = 600
      answerText.padding.set(5, 5)
      answerText.font = 'Bangers'
      answerText.anchor.x = 0.5
      answerText.fontSize = 25

      this.answers[i] = new PhaserNineSlice.NineSlice(this.game,           // Phaser.Game
        0,            // x position
        0,            // y position
        'general-1',      // atlas key
        'yellow-button.png', // Image frame
        620,            // expected width
        answerText.height,            // expected height
        { // And this is the framedata, normally this is passed when preloading. Check README for details
          top: 30,    // Amount of pixels for top
          bottom: 23, // Amount of pixels for bottom
          left: 30,   // Amount of pixels for left
          right: 28   // Amount of pixels for right
        })

      this.answers[i].answerText = answerText
      this.answers[i].anchor.x = 0.5
      this.answers[i].inputEnabled = true
      this.answers[i].events.onInputUp.add(this.selectAnswer, this)

      group.add(this.answers[i])
      group.add(answerText)

      group.position.setTo(this.game.world.centerX, nextPositionY)
      nextPositionY += (this.answers[i].height + gap)
    }
  }

  closeHandler () {
    this.closeEvent.dispatch()
  }

  selectAnswer (target) {
    if (target !== this.answers[this.questionData.correctAnswer]) { // wrong answer
      this.isAnsweredCorrect = false
      let redBg = new PhaserNineSlice.NineSlice(this.game,           // Phaser.Game
        0,            // x position
        0,            // y position
        'general-1',      // atlas key
        'red-button.png', // Image frame
        620,            // expected width
        target.height,            // expected height
        { // And this is the framedata, normally this is passed when preloading. Check README for details
          top: 30,    // Amount of pixels for top
          bottom: 23, // Amount of pixels for bottom
          left: 30,   // Amount of pixels for left
          right: 28   // Amount of pixels for right
        })

      redBg.anchor.x = 0.5
      target.parent.add(redBg)
      console.log(target.answerText.text)
      target.parent.removeChild(target.answerText)
      target.parent.add(target.answerText)

      target.parent.removeChild(target)
    } else { // correct answer
      let redBg = new PhaserNineSlice.NineSlice(this.game,           // Phaser.Game
        0,            // x position
        0,            // y position
        'general-1',      // atlas key
        'green-button.png', // Image frame
        620,            // expected width
        target.height,            // expected height
        { // And this is the framedata, normally this is passed when preloading. Check README for details
          top: 30,    // Amount of pixels for top
          bottom: 23, // Amount of pixels for bottom
          left: 30,   // Amount of pixels for left
          right: 28   // Amount of pixels for right
        })

      redBg.anchor.x = 0.5
      target.parent.add(redBg)
      console.log(target.answerText.text)
      target.parent.removeChild(target.answerText)
      target.parent.add(target.answerText)
      target.parent.removeChild(target)

      this.answers.forEach(answer => answer.inputEnabled = false)

      this.questionAnsweredEvent.dispatch(this.isAnsweredCorrect)
    }
  }
}
