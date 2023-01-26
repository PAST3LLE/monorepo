export class Vector {
  X: number
  Y: number
  X1: number
  Y1: number

  constructor(x: number, y: number, x1: number, y1: number) {
    this.X = x
    this.Y = y
    this.X1 = x1
    this.Y1 = y1
  }

  dX() {
    return this.X1 - this.X
  }
  dY() {
    return this.Y1 - this.Y
  }
  Normalized() {
    const l = this.Length()
    return new Vector(this.X, this.Y, this.X + this.dX() / l, this.Y + this.dY() / l)
  }

  Length() {
    return Math.sqrt(Math.pow(this.dX(), 2) + Math.pow(this.dY(), 2))
  }

  Multiply(n: number) {
    return new Vector(this.X, this.Y, this.X + this.dX() * n, this.Y + this.dY() * n)
  }

  Clone() {
    return new Vector(this.X, this.Y, this.X1, this.Y1)
  }
}
