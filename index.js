const initEls = () => {
  // todo: press shift to reverse steps
  // todo: press ctrl and click to reset to white or black
  // todo: display help about keyboard shortcuts when pressing "?" key

  const steps = 15
  const brickRawWidth = 40
  const brickWidth = brickRawWidth + 2 // include borders and margins
  document.documentElement.style.setProperty('--brick-width', `${brickRawWidth}px`)

  const extractStep = (className) => {
    return className ? parseInt(className.substr(1), 10) : 0
  }

  const getNextStep = (step) => {
    if (step === undefined) {
      step = 0
    }

    let newStep = 0

    if (step < steps) {
      newStep = step + 1
    }

    return newStep
  }

  const doTransition = function (e) {
    if (!e.ctrlKey) {
      this.className = `_${getNextStep(extractStep(this.className))}`
    }
  }

  const enableTransition = (el) => {
    el.addEventListener('mouseover', doTransition)
    el.addEventListener('mousedown', doTransition)
  }

  const addEvents = () => {
    document.querySelectorAll('#bricksCt > span').forEach(enableTransition)
  }

  const generateEls = () => {
    const tpl = document.getElementById('brickTpl').content
    const bricksCt = document.getElementById('bricksCt')
    const nbRows = Math.floor((bricksCt.offsetHeight - 20) / brickWidth)
    const nbCols = Math.floor((bricksCt.offsetWidth - 20) / brickWidth)
    const nbBricks = Math.floor(nbRows * nbCols)

    resetCt(
      (nbRows * brickWidth),
      (nbCols * brickWidth),
    )

    for (let i = 0; i < nbBricks; i++) {
      const tplNode = document.importNode(tpl, true)
      bricksCt.appendChild(tplNode)
    }
  }

  const resetCt = (height, width) => {
    const linksEl = document.getElementById('links')
    const bricksCt = document.getElementById('bricksCt')

    height = height || (window.innerHeight - linksEl.offsetHeight - 20)
    width = width || (window.innerWidth - 20)

    bricksCt.style.width = `${width}px`
    bricksCt.style.height = `${height}px`
  }

  const init = () => {
    resetCt()
    generateEls()
    addEvents()
  }

  return {
    init,
  }
}

const initAnim = () => {
  const loopEveryNbFrames = 10
  let nbFrames = loopEveryNbFrames
  let animLoop

  const getRandEl = () => {
    const els = document.getElementById('bricksCt').querySelectorAll('span')
    const randomNum = Math.floor(Math.random()*(els.length))
    return els[randomNum]
  }

  const simulateHoverOnEl = (el) => {
    const event = new MouseEvent('mouseover', {
      view: window,
      bubbles: true,
      cancelable: true,
    })

    el.dispatchEvent(event)
  }

  const beginAnimLoop = () => {
    nbFrames++
    console.log(nbFrames)
    if (nbFrames >= loopEveryNbFrames) {
      nbFrames = 0
      simulateHoverOnEl(getRandEl())
    }

    animLoop = window.requestAnimationFrame(beginAnimLoop)
  }

  const cancelAnimLoop = () => {
    clearTimeout(animLoop)
    window.cancelAnimationFrame(animLoop)
  }

  return {
    begin: beginAnimLoop,
    cancel: cancelAnimLoop,
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // todo: add button to pause/unpause hover animation
  initEls().init()

  window.animLoop = initAnim()
  window.animLoop.begin()
})
