function getZoom(screen) {
  return +(screen.style.transform.match(/scale\((.*?)\)/) || [0,1]) [1]
}

module.exports = {
  findMyScreen,
  getDisplayViewPort,
  getZoom
}
