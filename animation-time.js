const Value = require('mutant/value')
const raf = require('raf')

module.exports = function() {
  const t = Value(0)
  let stopped = false
  raf( function update() {
    if (!stopped) {
      t.set(Date.now())
      raf(update)
    }
  })
  t.stop = ()=>{
    stopped = true
  }
  return t
}

