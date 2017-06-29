/**
 * Created by ashot on 6/5/17.
 */
import Popup from '../Popup'
import Phaser from 'phaser'
export default class NewspaperPopup extends Popup {
  constructor (game) {
    super(game, 'atlas2-2', 'newspaperZoom.png')
    this.onNewspaperComplete = new Phaser.Signal()
    const headerWidth = 630
    const bodyWidth = 630

    this.image.inputEnabled = true
    this.image.y = this.image.height / 2

    this.setInfoPanel('level2-newspaper-panel')

    //  Title
    let titleText = this.game.add.text(this.game.world.centerX, 100, 'level2-newspaper-title', null, this)
    titleText.anchor.setTo(0.5)
    titleText.font = 'PT Sans'
    titleText.fontSize = 50

    this.hiddenWords = []

    //  Header
    this.headerContainer = this.game.add.group(this)
    this.headerContainer.x = 650
    this.headerContainer.y = 205

    let headerText = window.i18next.t('level2-newspaper-header')
    this.getPositionedText(headerText, this.headerContainer, headerWidth, 0, 5, 22, 'PT Sans', 32, 15)

    //  Body
    this.bodyContainer = this.game.add.group(this)
    this.bodyContainer.x = 650
    this.bodyContainer.y = 595

    let bodyText = window.i18next.t('level2-newspaper-body')
    this.getPositionedText(bodyText, this.bodyContainer, bodyWidth, 0, 5, 20, 'PT Sans', 22, 10)
  }

  getPositionedText (text, parent, maxWidth, x, y, fontSize, font, rowGap, wordGap) {
    text = text.split(/\s*§\s*/)

    let words = []
    for (let i = 0; i < text.length; i++) {
      if (text[i].charAt(0) !== '_') {
        let keyLessWords = text[i].split(' ')
        for (let j = 0; j < keyLessWords.length; j++) {
          words.push(keyLessWords[j])
        }
      } else {
        words.push(text[i])
      }
    }

    let xPos = x
    let yPos = y
    for (let i = 0; i < words.length; i++) {
      let word = this.game.add.text(xPos, yPos, words[i], {font: font, fontSize: fontSize}, parent)
      xPos += word.width + wordGap
      if (xPos > maxWidth) {
        if (word.width > maxWidth) {
          word.wordWrap = true
          word.wordWrapWidth = maxWidth
        } else {
          xPos = 0
          yPos += rowGap
          word.x = xPos
          word.y = yPos
          xPos += word.width + wordGap
        }
      }
      if (words[i].charAt(0) === '_') {
        let key = words[i].charAt(1)
        word.text = word.text.slice(2, word.text.length)
        word.events.onInputDown.add(this.onHiddenWordClick.bind(this, word, key))
        word.inputEnabled = true
        word.input.useHandCursor = true
        this.hiddenWords.push(word)
      }
    }
  }

  onHiddenWordClick (word, key) {
    this.removeInfoPanel()

    let index = this.hiddenWords.indexOf(word)
    this.hiddenWords.splice(index, 1)
    this.underlineText(word)
    this.animateHiddenKey(key)
    word.inputEnabled = false
    if (this.hiddenWords.length === 0) {
      this.image.inputEnabled = false
      this.onNewspaperComplete.dispatch()
    }
  }

  underlineText (textObj) {
    let underline = this.game.add.graphics(0, textObj.height - 5)
    underline.lineStyle(textObj.height / 10, 0xff0000)
    underline.moveTo(0, 0)
    underline.lineTo(textObj.width, 0)
    textObj.addChild(underline)
    underline.wordWrap = true
    underline.wordWrapWidth = 630
  }

  animateHiddenKey (key) {
    key = window.i18next.t('hiddenWord' + key)
    let hiddenWordKey = this.game.add.text(950, 220, key, {font: 'PT Sans', fontSize: 30, fill: '#ff0000'}, this)
    hiddenWordKey.anchor.set(0.5)
    let tweenTextAlpha = this.game.add.tween(hiddenWordKey).to({alpha: 0}, 2000).start()
    tweenTextAlpha.onComplete.add(this.removeHiddenWordKey.bind(this, hiddenWordKey))
  }
  removeHiddenWordKey (hiddenWordKey) {
    hiddenWordKey.destroy()
  }
}
