
function ObjectRenderer(ssb, scene) {
  
  return function renderObject(value, kp) {
    if ((value.content && value.content.type) !== '3d-object') return
    const c = value.content

    if (!c.model || !ref.isMsgId(c.model)) return

    //console.log('rendering 3d object', c)

    const position = c.position
    const rotation = c.rotation
    const scale = c.scale
    const name = c.name

    ssb.cms.getReduced(c.model, (err, value) => {
      if (err) return console.error(err)
      const geoRef = value.content.geometry
      if (!geoRef || !ref.isBlobId(geoRef)) return

      const done = multicb({pluck: 1, spread: true})

      const materialSpec = value.content.material
      loadOrCreateMaterial(materialSpec, done())
      loadGeometry(geoRef, done())

      done( (err, material, geometry) => {
        if (err) return console.error(err) 
        console.log('got geometry and material')
        const mesh = new THREE.Mesh( geometry, material )

        if (position) {
          mesh.position.x = position.x || 0
          mesh.position.y = position.y || 0
          mesh.position.z = position.z || 0
        }

        if (rotation) {
          mesh.rotation.x = rotation.x || 0
          mesh.rotation.y = rotation.y || 0
          mesh.rotation.z = rotation.z || 0
        }

        if (scale) {
          mesh.scale.x = scale.x || 1
          mesh.scale.y = scale.y || 1
          mesh.scale.z = scale.z || 1
        }

        mesh.name = name
        scene.add( mesh )

      })

    })
    
    return h('div')
  }
}
