const h = require('mutant/html-element')
const Value = require('mutant/value')
const computed = require('mutant/computed')
const watch = require('mutant/watch')
const THREE = require('three')
const OrbitControls = require('three-orbitcontrols')
const AnimationTime = require('./animation-time')
const traverse = require('traverse')

module.exports = function ThreeRenderer(ssb, opts) {
  opts = opts || {}

  return function renderScene(kv, ctx) {
    ctx = ctx || {}
    if ((kv && kv.value && kv.value.content && kv.value.content.type) !== '3d-scene') return

    const previewObs = ctx.previewObs || Value(kv)
    const viewportObs = ctx.viewportObs || Value({width: 1920, height: 1080})
    const settingsObs = computed(previewObs, kv=>{
      if (!kv) return {}
      return kv.value.content.settings || {}
    })

    const renderer = new THREE.WebGLRenderer()
    const el = renderer.domElement
    el.style.position = "absolute"
    el.style.top = "0px"
    el.style.left = "0px"
    el.style.zIndex = "-1"

    const camera = new THREE.PerspectiveCamera( 10, 16 / 9, 1, 2000 )

    const abortWatchViewport = watch(viewportObs, viewport => {
      renderer.setSize(viewport.width, viewport.height)
      camera.aspect = viewport.width / viewport.height
    })

    const scene = new THREE.Scene()
    const controls = Controls(camera, el)
    const hemLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)

    scene.add(hemLight)
    scene.add(directionalLight)
    directionalLight.position.x = -1

    if (ctx.unitSphere) {
      addUnitSphere(scene)
    }

    if (ctx.onScene) {
      ctx.onScene(scene)
    }

    const settings = {
      camera,
      controls,
      hemLight,
      directionalLight
    }

    const abortWatchSettings = watch(settingsObs, contentSettings => {
      const cs = traverse(contentSettings)
      const ts = traverse(settings)
      ts.forEach( function(v) {
        if (this.isLeaf) {
          if (cs.has(this.path)) {
            const newv = cs.get(path)
            console.log(`Setting ${this.path} from ${v} to ${newv}`)
            ts.set(this.path, v)
          }
        }
      })
    })

    const t = AnimationTime()
    const abortWatchTimer = watch(t, t => {
      //camera.rotation.z += 0.01
      controls.update()
      renderer.render(scene, camera)
    })

    function release() {
      abortWatchTimer()
      abortWatchViewport()
      abortWatchSettings()
      t.stop()
    }

    return h('.tre-3d--scene', {
      hooks: [el => release]
    }, [
      el
    ])

  }
}

//-- utils

function Controls(camera, el) {
  const controls = new OrbitControls( camera, el )
  controls.addEventListener('change', e => {
    let event = new UIEvent('input', {
      view: window,
      bubbles: true,
      cancelable: true
    })
    let cancelled = !el.dispatchEvent(event)
  })
  controls.target = new THREE.Vector3(0, 0, 0)
  controls.zoomSpeed = 0.15
  controls.rotateSpeed = 0.15
  controls.enablePan = false
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.2
  camera.position.z = 15
  return controls
}

function addUnitSphere(scene) {
  const geometry = new THREE.SphereGeometry( 1, 30, 30 )
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true})
  const sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)
}

