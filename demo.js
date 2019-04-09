const h = require('mutant/html-element')
const ThreeRenderer = require('.')

const renderScene = ThreeRenderer({})

document.body.appendChild(h('.tre-three-demo', [
  renderScene({
    key: 'fake',
    value: {
      content: {
        type: '3d-scene'
      }
    }
  }, {
    unitSphere: true
  })
]))
