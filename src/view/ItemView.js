/**
 * Created by khachatur on 6/29/17.
 */
import Phaser from 'phaser'

export default class ItemView extends Phaser.Image {

  constructor (game, key) {
    super(game, 0, 0, 'general', key)

    this.onShakeStop = new Phaser.Signal()
    this.anchor.setTo(0.5)
    this.scale.setTo(0.6)
  }

  startShake () {
    let tween = this.game.add.tween(this)
    tween.onComplete.add(this.onShakeComplete, this)
    tween.to({x: this.position.x + 10}, 3000, this.shakeEasing.bind(this), true, this.game.rnd.integerInRange(0, 1000))
  }

  tweenTo (x, y) {
    this.visible = true
    let duration = this.game.rnd.integerInRange(1000, 1500)
    let delay = this.game.rnd.integerInRange(0, 700)
    let tween = this.game.add.tween(this)
    tween.to({x: x, y: y}, duration, Phaser.Easing.Back.Out, true, delay)
    let scaleTween = this.game.add.tween(this.scale)
    scaleTween.to({x: 1, y: 1}, duration, Phaser.Easing.Bounce.Out, true, delay)
  }

  shakeEasing (k) {
    return this.wiggle(k, 10, 8)
  }

  wiggle (aProgress, aPeriod1, aPeriod2) {
    var current1 = aProgress * Math.PI * 2 * aPeriod1
    var current2 = aProgress * (Math.PI * 2 * aPeriod2 + Math.PI / 2)

    return Math.sin(current1) * Math.cos(current2)
  }

  onShakeComplete () {
    this.rotation = this.game.math.degToRad((this.game.math.radToDeg(this.rotation) % 360))
    this.onShakeStop.dispatch()
  }
}
