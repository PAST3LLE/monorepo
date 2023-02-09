import { LightningConfig, LineConfig } from '../types'
import { Vector } from '../vector'

export class Lightning {
  config: LightningConfig

  constructor(c: LightningConfig) {
    this.config = c
  }

  Cast(context: CanvasRenderingContext2D, from: { X1: number; Y1: number }, to: { X1: number; Y1: number }) {
    context.save()

    if (!from || !to) {
      return
    }
    //Main vector
    const v = new Vector(from.X1, from.Y1, to.X1, to.Y1)
    //skip cas if not close enough
    if (this.config.Threshold && v.Length() > context.canvas.width * this.config.Threshold) {
      return
    }
    const vLen = v.Length()
    let refv = from
    const lR = vLen / context.canvas.width
    //count of segemnets
    const segments = Math.floor(this.config.Segments * lR)
    //lenth of each
    const l = vLen / segments

    for (let i = 1; i <= segments; i++) {
      //position in the main vector
      const dv = v.Multiply((1 / segments) * i)

      //add position noise
      if (i != segments) {
        dv.Y1 += l * Math.random()
        dv.X1 += l * Math.random()
      }

      //new vector for segment
      const r = new Vector(refv.X1, refv.Y1, dv.X1, dv.Y1)

      //background blur
      this.Line(context, r, {
        Color: this.config.GlowColor,
        Width: this.config.GlowWidth * lR,
        Blur: this.config.GlowBlur * lR,
        BlurColor: this.config.GlowColor,
        Alpha: this.Random(this.config.GlowAlpha, this.config.GlowAlpha * 2) / 100
      })

      //main line
      this.Line(context, r, {
        Color: this.config.Color,
        Width: this.config.Width,
        Blur: this.config.Blur,
        BlurColor: this.config.BlurColor,
        Alpha: this.config.Alpha
      })
      refv = r
    }

    this.Circle(context, to, lR)
    this.Circle(context, from, lR)

    context.restore()
  }

  Circle(context: CanvasRenderingContext2D, p: { X1: number; Y1: number }, lR: number) {
    context.beginPath()
    context.arc(p.X1 + Math.random() * 10 * lR, p.Y1 + Math.random() * 10 * lR, 5, 0, 2 * Math.PI, false)
    context.fillStyle = 'transparent'
    context.shadowBlur = 100
    context.shadowColor = '#2319FF'
    context.fill()
  }

  Line(context: CanvasRenderingContext2D, v: { X: number; Y: number; X1: number; Y1: number }, c: LineConfig) {
    context.beginPath()
    context.strokeStyle = c.Color
    context.lineWidth = c.Width
    context.moveTo(v.X, v.Y)
    context.lineTo(v.X1, v.Y1)
    context.globalAlpha = c.Alpha
    context.shadowBlur = c.Blur
    context.shadowColor = c.BlurColor
    context.stroke()
  }

  Random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min
  }
}
