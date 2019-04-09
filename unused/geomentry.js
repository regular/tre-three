const loadGeometry = memoize( function(geoRef, cb) {
  const geoLoader = new THREE.JSONLoader()
  geoLoader.load(`${config.blobsRoot}/${encodeURIComponent(geoRef)}`, (geometry, materials) =>{
    console.log('got geometry from THREE.JSONLoader')
    cb(null, geometry)
  }, progress => {
    //console.log('geometry progress', progress.loaded / progress.total)
  }, err =>{
    cb(err)
  })
})


