import p5 from "p5"

// ------------- VARS ------------- //
const config = {
  frameRate: 144,
}

class Window {
  w: number = 0
  h: number = 0
  s: number = 0
  l: number = 0
  t: number = 0
}

const win = new Window()

let pGlobal: p5

const sketch = (p: p5) => {
  let palette = {black: "#09001c", purple: "#953fb5", green: "#c7ff59", white: "#fcfeff"}
  let roboto: p5.Font
  let seagrass_out: p5.Graphics
  let seagrass: p5.Shader
  let time: number = 0
  // ------------- SETUP ------------- //
  p.preload = () => {
    roboto = p.loadFont(
      require("./fonts/ROBOTOMONO-VARIABLEFONT_WGHT.ttf").default
    )
  }
  p.setup = () => {
    pGlobal = p

    // Canvas
    win.w = window.innerWidth
    win.h = window.innerHeight
    win.s = Math.min(window.innerWidth, window.innerHeight)
    win.t = (win.h - win.s) / 2
    win.l = (win.w - win.s) / 2

    p.setAttributes("antialias", true)
    p.smooth()
    p.createCanvas(win.s, win.s, p.WEBGL)
    seagrass_out = p.createGraphics(win.s, win.s, p.WEBGL)
    seagrass_out.setAttributes("antialias", true)
    seagrass_out.smooth()
	  seagrass_out.background(0, 0)

    p.textFont(roboto)
    p.textAlign(p.CENTER, p.CENTER)
    // You can create shaders like this.
    const vertSrc = require("./shaders/quad.vert").default
    seagrass = seagrass_out.createShader(vertSrc, require("./shaders/seagrass.frag").default)
  }

  // ------------- DRAW ------------- //
  p.draw = () => {
    p.background(palette.black)

    p.translate(-p.width/2, -p.height/2)

    p.push()
      p.translate(win.s*1/8, win.s*1/8-win.s*1/24)
      p.textSize(win.s/6)
      p.fill(palette.white)
      p.noStroke()

      p.text("ã", win.s * 3/4, win.s * 0 )
      p.text("ö", win.s * 3/4, win.s * 1/4 )
      p.text("ž", win.s * 3/4, win.s * 2/4 )
      
      p.text("ē", win.s * 0, win.s * 3/4 )
      p.text("ç", win.s * 1/4, win.s * 3/4 )
      p.text("ư", win.s * 2/4, win.s * 3/4 )
    p.pop()
    p.push()
      p.translate(win.s*1/8, win.s*1/8-win.s/36)
      
      p.textSize(win.s/18)
      p.fill(palette.green)
      p.noStroke()

      p.text("dia", win.s * 3/4, win.s * 3/4 - win.s/18 )
      p.text("cri", win.s * 3/4, win.s * 3/4 )
      p.text("tic", win.s * 3/4, win.s * 3/4 + win.s/18 )
    p.pop()

    seagrass_out.shader(seagrass)
    seagrass.setUniform("u_resolution", [p.width, p.height])
    seagrass.setUniform("u_time", p.millis()/1000)
    let convert = (c:string) => {
      let text = p.color(c).toString()
      text = text.substring(text.indexOf("(")+1, text.indexOf(",1"))
      return text.split(",").map(v=>Number(v)/256);
    }
    seagrass.setUniform("col1", convert(palette.white))
    seagrass.setUniform("col2", convert(palette.black))
    seagrass_out.quad(-1, -1, 1, -1, 1, 1, -1, 1)

    let thiccness = win.s/24.

    p.push()
      p.fill(palette.purple)
      p.noStroke()
      p.rect(win.s*3/4 - thiccness, 0, thiccness, win.s*3/4);
      p.rect(0, win.s*3/4 - thiccness, win.s*3/4, thiccness);
    p.pop()

    p.image(seagrass_out, 0, 0)
    
    p.push()
      p.fill(palette.purple)
      p.noStroke()
      p.rect(0, 0, thiccness, win.s*3/4);
      p.rect(0, 0, win.s*3/4, thiccness);
    p.pop()
  }
  p.windowResized = () => {
    p.setup()
  }
}

new p5(sketch)
