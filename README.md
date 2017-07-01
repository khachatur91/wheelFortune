# Wheel Of Fortune Slot Machine.

(wheelFortune/preview.jpg)

## Technology
- ESLINT with JavaScript Standard Style configuration
- Next generation of Javascript (ES6)
- Phaser game engine
- Webpack ready
- Multiple browser testin

# Setup
install all dependencies       - npm install 
development server run command - npm run dev
build for deployment           - npm run deploy

# Game
The game is kind of a mix of slot machine and wheel of fortune

Click "Play" to spin the wheel
Blur effect is implemented for the wheel, while it's spinning
When all reals reach to their max speed, "Stop" button becomes active
Click "Stop" to stop the wheel

3 main raws are differed with a light on the wheel
As in the circular environment items from different raws are going farther from each other, 
an additional popup appears where all those items tween and make a proper 3 lines for slot proper view
After popup disappears, "Play" button becomes active

# Scenes
Game has 2 scenes BootState and GameState

## BootState
Responsible for showing a logo and loading assets

## GameState
All the interesting stuff happens here

# Code Structure
For the Wheel component it's used an MVC design
In game state WheelModel is made which is passed to WheelController and WheelView
WheelModel has Phaser.Signals which are the main way for communication bettwen Controller and View

A util ColorContainer popup component, which appears during the session end, is not implemented in MVC because of having not much virality 
