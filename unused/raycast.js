
        'ev-click': function(event) {
          const raycaster = new THREE.Raycaster()
          const mouse = new THREE.Vector2()

          const screen = this
          const zoom = getZoom(screen)

          // calculate mouse position in normalized device coordinates
          // (-1 to +1) for both components
          const mx = event.clientX - zoom * parseInt(getComputedStyle(renderer.domElement).left || 0)
          console.log('mx', mx)
          mouse.x = ( mx / viewport.width / zoom) * 2 - 1
          mouse.y = - ( event.clientY / viewport.height / zoom) * 2 + 1
          
          raycaster.setFromCamera( mouse, camera );
          const intersects = raycaster.intersectObjects( scene.children )
          
          if (intersects.length && intersects[0].object.content) {
            const poi = intersects[0].object
            //poi.material.color.set(0xff0000)
            const link = poi.content.link || poi.key
            if (ref.isMsgId(link)) {
              savedCameraPosition = new THREE.Vector3()
              savedCameraPosition.copy(camera.position)
              document.location.hash = `#${link}` 
            }
          }
          
          /*
          intersects.forEach( i => {
            i.object.material.color.set( 0xff0000 )
          })
          */
        },
