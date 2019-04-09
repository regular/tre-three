
    const updateSlider = (function(initial, minDelta) {
      let lastValue = initial

      return function updateSlider(slider, camera) {
        var target = new THREE.Vector3()
        var position = camera.position
        var spherical = new THREE.Spherical()
        var offset = new THREE.Vector3()
        offset.copy( position ).sub( target )

        spherical.setFromVector3( offset )
        spherical.makeSafe()
        let distance = spherical.radius

        if (Math.abs(distance - lastValue) < minDelta) return
        lastValue = distance

        let event = document.createEvent("CustomEvent")
        event.initCustomEvent("update", true, true, distance)
        let cancelled = !slider.dispatchEvent(event)
      }
    })(-100, 0.00001)

    function updateDistance(camera, distance) {
      var target = new THREE.Vector3()
      var position = camera.position
      var spherical = new THREE.Spherical()
      var offset = new THREE.Vector3()
      offset.copy( position ).sub( target )

      // rotate offset to "y-axis-is-up" space
      //offset.applyQuaternion( quat );

      // angle from z-axis around y-axis
      spherical.setFromVector3( offset )
      spherical.makeSafe()
      spherical.radius = distance
      //spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );
      offset.setFromSpherical( spherical )

      // rotate offset back to "camera-up-vector-is-up" space
      //offset.applyQuaternion( quatInverse );

      position.copy( target ).add( offset )
      camera.lookAt( target )
    }
