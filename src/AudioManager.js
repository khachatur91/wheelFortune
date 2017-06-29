/**
 * Created by khachatur on 6/29/17.
 */

// eslint-disable-next-line symbol-description
const singleton = Symbol()
// eslint-disable-next-line symbol-description
const singletonEnforcer = Symbol()

export default class AudioManager {

  static get instance () {
    if (!this[singleton]) {
      this[singleton] = new AudioManager(singletonEnforcer)
    }
    return this[singleton]
  }

  constructor (enforcer) {
    if (enforcer !== singletonEnforcer) throw new TypeError('Cannot construct singleton')
    this.game = window.game
    this.sounds = []
    this.commads = []
    this.decoded = false
    this.mapMusic = this.game.add.audio('mapMusic')
    this.gameMusic = this.game.add.audio('gameMusic')
    this.popup = this.game.add.audio('popup')
    this.button = this.game.add.audio('button')
    this.shake = this.game.add.audio('shake')
    this.energy = this.game.add.audio('energy')
    this.pick = this.game.add.audio('pick')
    this.put = this.game.add.audio('put')
    this.fall = this.game.add.audio('fall')
    this.bridge = this.game.add.audio('bridge')
    this.failPopup = this.game.add.audio('failPopup')
    this.noEnergyPopup = this.game.add.audio('noEnergyPopup')
    this.sounds.push(this.mapMusic)
    this.sounds.push(this.gameMusic)
    this.sounds.push(this.popup)
    this.sounds.push(this.button)
    this.sounds.push(this.shake)
    this.sounds.push(this.energy)
    this.sounds.push(this.put)
    this.sounds.push(this.pick)
    this.sounds.push(this.fall)
    this.sounds.push(this.failPopup)
    this.sounds.push(this.noEnergyPopup)
    this.game.sound.setDecodedCallback(this.sounds, this.onDecode, this)
  }

  fadeIn (key, duration, loop, marker) {
    if (!this.hasOwnProperty(key)) {
      console.warn('Can\'t find audio key \'' + key + '\'')
      return
    }
    if (this.decoded) {
      this[key].fadeIn(duration, loop, marker)
    } else {
      this.commads.push({
        context: this[key],
        command: this[key].fadeIn,
        duration: duration,
        loop: loop,
        marker: marker
      })
    }
  }

  fadeOut (key) {
    if (!this.hasOwnProperty(key)) {
      console.warn('Can\'t find audio key \'' + key + '\'')
      return
    }
    this[key].fadeOut()
  }

  play (key) {
    console.log(this)
    if (this.decoded) {
      this[key].play()
    }
  }

  getSound (key) {
    return this[key]
  }

  onDecode () {
    this.decoded = true
    this.commads.forEach((value, index) => {
      value.command.call(value.context, value.duration, value.loop, value.marker)
    })
  }
}
