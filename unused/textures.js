const multicb = require('multicb')
const memoizeAsync = require('memoizeasync')

const loadTexture = memoize( function(map, cb) {
  const textureLoader = new THREE.TextureLoader()
  console.log('loading texture from', map)
  textureLoader.load(
    map,
    texture => {
      console.log('done loading texture')
      cb(null, texture)
    },
    progress => console.log('texture progress', progress.loaded / progress.total),
    err => cb(err)
  )
})

const loadCubeTexture = memoize( function(envMap, cb) {
  const maps = "left right top bottom front back".split(' ').map( k => envMap[k] )
  new THREE.CubeTextureLoader().load(
    maps,
    texture => {
      console.log('done loading cube texture')
      cb(null, texture)
    },
    progress => console.log('cube texture progress', progress.loaded / progress.total),
    err => cb(err)
  )
})

// -- utils

function memoize(f) {
  return memoizeAsync(f, {
    argumentsStringifier: args => args.map( arg => JSON.stringify(arg) ).join('')
  })
}

function resolveAllBlobReferencesToURLs(blobsRoot, o) {
  // turn all blob-references into blob-URLs
  traverse(o || {}).forEach( function(v) {
    if (ref.isBlob(v)) {
      this.update(`${blobsRoot}/${encodeURIComponent(v)}`)
    }
  })
}

function isNumber(v) {
  return typeof v === 'number'
}

