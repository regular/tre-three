const loadOrCreateMaterial = memoize( function (materialSpec, cb) {
  let done = multicb()

  if (materialSpec) {
    let spec = Object.assign({}, materialSpec)
    resolveAllBlobReferencesToURLs(spec)

    if (spec.envMap) {
      const cb = done()
      loadCubeTexture(spec.envMap, (err, texture) => {
        if (err) return cb(err)
        spec.envMap = texture  
        cb(null)
      })
    }

    if (spec.map) {
      const cb = done()
      loadTexture(spec.map, (err, texture) => {
        if (err) return cb(err)
        spec.map = texture  
        cb(null)
      })
    }

    done( ()=> {
      if (spec.type) {
        let mat = null
        // hardcode for security
        const ctors = 'LineBasicMaterial LineDashedMaterial Material MeshBasicMaterial MeshDepthMaterial MeshLambertMaterial MeshNormalMaterial MeshPhongMaterial MeshPhysicalMaterial MeshStandardMaterial MeshToonMaterial PointsMaterial RawShaderMaterial ShaderMaterial ShadowMaterial SpriteMaterial'.split(' ')

        if (ctors.includes(spec.type)) {
          try {
            //spec.specular = 0xffffff
            mat = new THREE[spec.type](spec)
          } catch(e) {
            console.error(`Failed to create material ${spec.type}: ${e}`)
            return cb(e)
          }
          return cb(null, mat)
        } else {
          return cb(new Error(`Unsupported material type ${spec.type}`))
        }
      } else {
        console.log('No materialspec.type - using default material')
        return cb(null, new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } ))
      }
    })   
  } else {
    console.log('No material spec - using default material')
    return cb(null, new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } ))
  }
})

