
        'ev-input': function(e) {
          if (e.target.tagName === 'CANVAS') { // comes from controls
            // Update slider
            let distanceSlider = document.querySelector('.slider#controls\\.distance')
            if (distanceSlider) {
              updateSlider(distanceSlider, camera)
            }
          } else {
            //let path = e.target.id
            //traverse(settings).set(path.split('.'), e.target.value)
            
            let v = e.target.value
            console.log(e.target.id, e.target.value)
            switch(e.target.id) {
              case 'controls.distance': 
                updateDistance(camera, v)
                break;
              case 'x': cube.position.x = v; break;
              case 'y': cube.position.y = v; break;
              case 'z': cube.position.z = v; break;
              case 'scale': cube.scale.x = cube.scale.y = cube.scale.z = v; break;
              case 'rotation.x': cube.rotation.x = v; break;
              case 'rotation.y': cube.rotation.y = v; break;
              case 'rotation.z': cube.rotation.z = v; break;
            }

          }
        }
