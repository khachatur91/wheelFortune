/**
 * Created by khachatur on 6/29/17.
 */
import Phaser from 'phaser'
import ItemView from './ItemView'

export default class ReelView extends Phaser.Group {

  constructor (game, parts, radius, color) {
    super(game)

    this.itemPadding = 50

    this.radius = radius
    this.parts = parts

    this.onStop = new Phaser.Signal()

    let graphics = this.game.make.graphics()
    graphics.beginFill(color)
    graphics.drawCircle(0, 0, radius * 2)
    graphics.endFill()

    this.currentItemIndex = 0
    this.items = []

    this.bgImage = this.game.add.image(0, 0, graphics.generateTexture(), null, this)
    this.bgImage.anchor.setTo(0.5)
    graphics.destroy()
    this.sectorAngle = game.math.degToRad(360 / parts.length)
    let icon
    let offsetRad = -Math.PI / 2
    for (let i = 0, length = this.parts.length; i < length; i++) {
      icon = new ItemView(this.game, parts[i])
      icon.rotation =  -this.sectorAngle * i
      icon.position.setTo((this.radius - this.itemPadding) * Math.sin( this.sectorAngle * i + offsetRad),
        (this.radius - this.itemPadding) * Math.cos( this.sectorAngle * i + offsetRad))
      this.add(icon)
      this.items.push(icon)
    }
  }

  startItemShake () {
    this.items[(this.currentItemIndex - 1 + this.parts.length) % this.parts.length].startShake()
    this.items[this.currentItemIndex].startShake()
    this.items[(this.currentItemIndex + 1) % this.parts.length].startShake()
  }

  setDestinationIndex (index) {
    index = index || this.game.rnd.integerInRange(0, this.parts.length - 1)
    this.currentItemIndex = index
    this.rotationSteps = this.game.rnd.integerInRange(3,6) * this.parts.length + index
  }

  startRotation () {
    this.tween = this.game.add.tween(this)
    let duration = this.game.rnd.integerInRange(2000,5000)
    let delay = this.game.rnd.integerInRange(0,2000)
    let toRotation = this.sectorAngle * this.rotationSteps
    this.tween.to({rotation:  toRotation}, duration, Phaser.Easing.Quadratic.InOut, true, delay)
    this.tween.onComplete.add(this.onRotationComplete, this)
  }

  stopRotation () {
    if (this.tween && this.tween.isRunning) {
      this.tween.stop()
    }
  }

  onRotationComplete () {
    this.rotation = this.game.math.degToRad((this.game.math.radToDeg(this.rotation) % 360))
    this.onStop.dispatch()
  }
}
