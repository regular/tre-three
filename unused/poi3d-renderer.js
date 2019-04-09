
function POI3DRenderer(ssb, scene) {
  
  return function renderPOI(value, kp) {
    if ((value.content && value.content.type) !== 'POI') return
    const c = value.content
    const pos = c.position
    if (! (pos && isNumber(pos.radius) && isNumber(pos.lon) && isNumber(pos.lat))) return
    if (! (c.icon && ref.isMsgId(c.icon))) return

    //console.log('rendering 3d POI', c)

    /*
    const poiGeometry = new THREE.SphereGeometry( 0.04, 16, 16 )
    var poiMaterial = new THREE.MeshPhongMaterial({
      shininess: 100,
      specular: 0xf0f0f0,
      color: 0x0c447d
    })
    const poi = new THREE.Mesh( poiGeometry, poiMaterial )
    */

    // Gibraltar
    //pos.lat = 36.133333
    //pos.lon = -5.35

    ssb.cms.getReduced(c.icon, (err, iconMsg) => {
      if (err) return cb(err)
      if (!(iconMsg.content && ref.isBlobId(iconMsg.content.image))) return cb(new Error(`invalid icon message ${c.icon}`))

      const materialSpec = { 
        type: 'SpriteMaterial',
        map: iconMsg.content.image,
        // map: '&QzrTnTx5HQmUYqQSg9A4ydoiTkg2JFVOJcD0GsZOqNg=.sha256',
        color: 0xffffff
      } 
      
      loadOrCreateMaterial(materialSpec, (err, spriteMaterial) =>{
        if (err) return console.error(err)
        const sprite = new THREE.Sprite(spriteMaterial)

        const spherical = new THREE.Spherical(
          pos.radius,
          (90.0 - pos.lat) / 180 * Math.PI,
          (pos.lon + 85.0 - 18) / 180 * Math.PI
        )
        sprite.position.setFromSpherical(spherical)

        const scale = c.scale || 0.08
        sprite.scale.copy(new THREE.Vector3(scale, scale, scale))
        sprite.name = c.name
        sprite.content = c
        sprite.key = getLastMessageId(kp)
        scene.add(sprite)
      })
    })

    return h('span')
  }
}
