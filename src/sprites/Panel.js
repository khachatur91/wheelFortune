/**
 * Created by khachatur on 4/21/17.
 */
import Phaser from 'phaser'
import HintButton from './HintButton'
import Game from '../main'

export default class Panel extends Phaser.Group {
  labelsArray = new Map()

  constructor (game, parent) {
    super(game, parent)

    this.onHintClick = new Phaser.Signal()
    this.onLevelComplete = new Phaser.Signal()

    this.game.add.image(0, 0, 'general-1', 'panel.png', this)

    this.hintButton = new HintButton(this.game, this)
    this.hintButton.position.setTo(1535, 34)
    this.hintButton.onHint.add(this.hintClickListener, this)

    this.exitButton = this.game.add.sprite(0, 0, 'general-1', 'exitButton.png', this)
    this.exitButton.position.setTo(150, 37)
    let exitButtonText = this.game.add.text(0, 0, 'exitButton', null, this)
    exitButtonText.anchor.setTo(0.5)
    exitButtonText.position.setTo(this.exitButton.width / 2, this.exitButton.height / 2)
    exitButtonText.fill = '#19520e'
    exitButtonText.font = 'PT Sans'
    exitButtonText.fontSize = 35
    this.exitButton.addChild(exitButtonText)
    this.exitButton.inputEnabled = true
    this.exitButton.events.onInputDown.add(this.onExitButtonClick, this)

    this.panelWordsContainer = this.game.add.group(this)
    this.panelWordsOffsetX = 520
    this.panelWordsOffsetY = 50
    this.panelWordsMaxWidth = 950
    this.panelWordsContainer.position.setTo(0, this.panelWordsOffsetY)
  }

  onExitButtonClick () {
    this.game.state.start(Game.INTRO)
  }

  hintClickListener () {
    this.hintButton.startCoolDown()
    let hintKey
    let arrayOfNotFoundItems = []
    this.labelsArray.forEach(function (item, key) {
      if (!item.isStroked) {
        arrayOfNotFoundItems.push(key)
      }
    }
    )
    hintKey = arrayOfNotFoundItems[this.game.rnd.integerInRange(0, arrayOfNotFoundItems.length - 1)]
    console.log(hintKey)
    this.onHintClick.dispatch(hintKey)
  }

  setPhrases (phrases) {
    let xOffset = 0
    let yOffset = 0
    let gap = 70
    let words = []
    let labelText

    for (let i = 0; i < phrases.length; i++) {
      labelText = this.game.add.text(0, 0, phrases[i], {'fill': '#ffffff'}, this.panelWordsContainer)
      this.labelsArray.set(phrases[i], labelText)
      words.push(labelText)
    }

    words.sort((a, b) => {
      if (a.width < b.width) {
        return 1
      }
      if (a.width > b.width) {
        return -1
      }
      return 0
    })

    let nextOffsetX = 0
    for (let i = 0; i < words.length; i++) {
      if (i % 2 === 0) {
        words[i].position.setTo(xOffset, yOffset)
        nextOffsetX = xOffset + words[i].width + gap
      } else {
        words[i].position.setTo(xOffset, yOffset + 50)
        xOffset = nextOffsetX
      }

      words[i].font = 'Amarante'
      words[i].padding.set(5, 5)
      words[i].fontSize = 30
    }

    let xPos = this.panelWordsOffsetX + (this.panelWordsMaxWidth - this.panelWordsContainer.width) / 2
    this.panelWordsContainer.position.x = xPos
  }

  isStroked (key) {
    if (this.labelsArray.get(key)) { return this.labelsArray.get(key).isStroked }
    return null
  }

  strokePhrase (key) {
    if (this.labelsArray.get(key) && !this.labelsArray.get(key).isStroked) {
      this.labelsArray.get(key).isStroked = true
      let text = this.labelsArray.get(key)
      let line = this.game.add.image(-text.width * 0.2, text.height * 0.6, 'general-1', 'line.png')
      text.addChild(line)
      line.width = text.width * 1.3
      line.height = text.height * 0.4
      line.angle = -5
    }

    let isLevelComplete = true
    this.labelsArray.forEach(function (member, key) {
      isLevelComplete = isLevelComplete && member.isStroked
    })

    if (isLevelComplete) {
      this.onLevelComplete.dispatch()
    }
  }
}
