export interface LineConfig {
  Color: string
  Width: number
  Blur: number
  BlurColor: string
  Alpha: number
}

export interface LightningConfig extends LineConfig {
  Segments: number
  Threshold: number
  GlowColor: string
  GlowWidth: number
  GlowBlur: number
  GlowAlpha: number
}
