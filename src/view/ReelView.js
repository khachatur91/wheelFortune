/**
 * Created by khachatur on 6/29/17.
 */
import Phaser from 'phaser'
import ItemView from './ItemView'

export default class ReelView extends Phaser.Group {

  constructor (game, parts, radius, color) {
    super(game)
    this.isRotating = false
    this.currentAngularSpeed = 0
    this.maxAngularSpeed = this.game.rnd.integerInRange(25, 30)
    this.itemPadding = 20

    this.gridItems = []
    this.radius = radius
    this.parts = parts

    this.onStop = new Phaser.Signal()
    this.onMaxSpeed = new Phaser.Signal()

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
      icon.rotation = -this.sectorAngle * i - Math.PI / 2// rotation could be used for other type of items
      icon.position.setTo((this.radius - this.itemPadding) * Math.sin(this.sectorAngle * i + offsetRad),
        (this.radius - this.itemPadding) * Math.cos(this.sectorAngle * i + offsetRad))
      this.add(icon)
      this.items.push(icon)
    }
  }

  startItemShake () {
    this.gridItems.forEach((item) => {
      item.startShake()
    })
  }

  getRawItems () {
    return this.gridItems
  }

  setDestinationIndex (index) {
    index = index || this.game.rnd.integerInRange(0, this.parts.length - 1)
    this.currentItemIndex = index
    let rotationSteps = this.game.rnd.integerInRange(2, 3) * this.parts.length + index

    this.toRotation = this.sectorAngle * rotationSteps

    this.gridItems.push(this.items[(this.currentItemIndex - 1 + this.parts.length) % this.parts.length])
    this.gridItems.push(this.items[this.currentItemIndex])
    this.gridItems.push(this.items[(this.currentItemIndex + 1) % this.parts.length])
  }

  startRotation () {
    this.isRotating = true
    this.tween = this.game.add.tween(this)
    let duration = this.game.rnd.integerInRange(3000, 4000)
    let delay = this.game.rnd.integerInRange(0, 500)
    this.tween.onComplete.add(this.onReachMaxSpeed, this)
    this.tween.to({currentAngularSpeed: this.maxAngularSpeed}, duration, Phaser.Easing.Quadratic.InOut, true, delay)
  }

  update () {
    if (this.isRotating) {
      this.rotation += this.currentAngularSpeed
    }
  }

  stopRotation () {
    if (!this.isRotating) {
      return
    }
    if (this.tween && this.tween.isRunning) {
      this.tween.stop()
    }

    this.tween = this.game.add.tween(this)
    this.convertRotationRange2PI()
    let duration = this.game.rnd.integerInRange(2000, 3000)

    this.currentAngularSpeed = 0
    this.isRotating = false
    this.tween.to({rotation: this.toRotation}, duration, Phaser.Easing.Quadratic.Out, true)
    this.tween.onComplete.add(this.onRotationComplete, this)
  }

  onRotationComplete () {
    this.convertRotationRange2PI()
    this.onStop.dispatch()
  }

  // wrap current rotation to appropriate one in range 0 - 2*PI
  convertRotationRange2PI () {
    this.rotation = this.game.math.degToRad((this.game.math.radToDeg(this.rotation) % 360))
  }

  onReachMaxSpeed () {
    this.onMaxSpeed.dispatch()
  }
}
