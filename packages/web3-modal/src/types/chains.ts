/**
 * @name ChainImages
 * @description Key/Value pair overriding chain image info. { ChainId: chainImageUri }
 */
export type ChainImages = {
  unknown?: string
  [id: number]: string
}
