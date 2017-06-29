/**
 * Created by khachatur on 4/26/17.
 */
import Phaser from 'phaser'
import QuestionView from './QuestionView'

export default class QuizPopup extends Phaser.Group {
  constructor (game, questions) {
    super(game, 0, 0)

    this.onQuestionsComplete = new Phaser.Signal()
    this.questions = questions

    let inactiveBgGraphics = this.game.make.graphics()
    inactiveBgGraphics.beginFill(0)
    inactiveBgGraphics.drawRect(0, 0, game.world.width, game.world.height)
    inactiveBgGraphics.endFill()

    this.inactiveBg = this.game.add.sprite(0, 0, inactiveBgGraphics.generateTexture(), null, this)
    this.inactiveBg.alpha = 0.7
    this.inactiveBg.inputEnabled = true

    this.image = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'general-2', 'popup-bg-quiz.png', this)
    this.image.anchor.setTo(0.5)

    this.currentQuestionIndex = 0

    this.nextQuestion()

    this.doctus = this.game.add.image(this.game.world.width, this.game.height - 184, 'general-2', 'doctus.png', this)
    this.doctus.anchor.y = 1

    let tween = this.game.add.tween(this.doctus)
    tween.to({x: 1300}, 700)
    tween.start()

    this.correctAnswers = 0
  }

  nextQuestion () {
    if (this.currentQuestionIndex === this.questions.length) {
      if (this.currentQuestion) {
        this.currentQuestion.destroy(true)
      }
      this.onQuestionsComplete.dispatch(this.correctAnswers, this.questions.length)
    } else {
      if (this.currentQuestion) {
        this.currentQuestion.destroy(true)
      }
      this.currentQuestion = new QuestionView(this.game, this.questions[this.currentQuestionIndex])
      this.currentQuestion.position.setTo(0, (this.height - this.currentQuestion.height) / 2)
      this.currentQuestion.questionAnsweredEvent.add(this.delayedNextQuestion, this)
      this.add(this.currentQuestion)

      this.currentQuestionIndex ++
    }
  }

  delayedNextQuestion (isAnsweredCorrect) {
    if (isAnsweredCorrect) {
      this.correctAnswers++
    }
    this.game.time.events.add(300, this.nextQuestion, this)
  }
}
