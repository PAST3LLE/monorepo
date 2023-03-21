const METADATA = [
  // COLLECTION 1
  [
    {
      description: 'ASCENDANCE.HOODIE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmPA7TbY6VS4Y3tMawXnhNj3bLtTKotMEdbjEcbF4vUwH7',
      name: 'ASCENDANCE',
      properties: {
        rarity: 'common',
        dependencies: [],
        shopifyId: '6758874447923',
        id: '1-1000'
      },
      attributes: {
        tags: ['hoodie', 'heavy-cotton', 'oversized'],
        theme: { bg: '#575C75', altBg: '#5A2E56', color: '#F1F2F1' }
      }
    },
    {
      description: 'DAYDREAMING.TEE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmQoQRBM7JTfYHb2skR2UWxrvauiP7iLMrc2eyAvcVhb7e',
      name: 'DAYDREAMING',
      properties: {
        rarity: 'common',
        dependencies: [],
        shopifyId: '6758884540467',
        id: '1-2000'
      },
      attributes: {
        tags: ['shortsleeve', 'heavy-cotton', 'oversized'],
        theme: { bg: '#BA96C6', altBg: '#7B649F', color: '#F8D5E0' }
      }
    },
    {
      description: 'ELLEX.TEE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmWB53TDta1wDjMvSCsRtqN3JNZgCnVcp8U6V1Q6t6eDUm',
      name: 'ELLEX',
      properties: {
        rarity: 'common',
        dependencies: [],
        shopifyId: '6758853771315',
        id: '1-3000'
      },
      attributes: {
        tags: ['shortsleeve', 'heavy-cotton', 'oversized'],
        theme: { bg: '#DBBBB9', altBg: '#C4D52A', color: '#dadadb' }
      }
    },
    {
      description: 'REBIRTH.TEE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmPTYa4M3dsPQiYDeDfsVu23EmcRx1gxYsX7sVzdwaFz64',
      name: 'REBIRTH',
      properties: {
        rarity: 'common',
        dependencies: [],
        shopifyId: '6758881984563',
        id: '1-4000'
      },
      attributes: {
        css: 'transform: scale(1.3);',
        tags: ['shortsleeve', 'heavy-cotton', 'oversized'],
        theme: { bg: '#2A1927', altBg: '#2C2C2C', color: '#1e1e1e' }
      }
    },
    {
      description: 'VIRGIL.LONGSLEEVE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmVpR9pRosyx6BePoyf2Vc9mK3CtnL2kni4eGSJcLYSRmP',
      name: 'VIRGIL',
      properties: {
        rarity: 'common',
        dependencies: [],
        shopifyId: '6755479486515',
        id: '1-5000'
      },
      attributes: {
        handle: 'virgil-longsleeve',
        tags: ['longsleeve', 'heavy-cotton', 'oversized'],
        theme: { bg: '#1F615D', altBg: '#551D27', color: '#1e1e1e' }
      }
    },
    {
      description: 'VOODOO.LONGSLEEVE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmSv543U145S855s6XtT6DKUJojNwAbmN6QNwQL5Vk7bKV',
      name: 'VOODOO',
      properties: {
        rarity: 'common',
        dependencies: [],
        shopifyId: '6758852821043',
        id: '1-6000'
      },
      attributes: {
        tags: ['longsleeve', 'heavy-cotton', 'oversized'],
        theme: { bg: '#C2E1CB', altBg: '#26297A', color: '#beb2d5' }
      }
    }
  ],
  // COLLECTION 2
  [
    {
      description: 'SHIPWRECK.LONGSLEEVE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmaWrhJejBsUYEwDsqiM6Y24gDmskAf54FKhzPXrMT8cTu',
      name: 'SHIPWRECK',
      properties: {
        rarity: 'rare',
        dependencies: ['1-1000', '1-3000', '1-5000'],
        shopifyId: 'SOME_SHOPIFY_ID',
        id: '2-1000'
      },
      attributes: {
        tags: ['hoodie', 'heavy-cotton', 'oversized'],
        theme: { bg: '#756d5e', altBg: '#26297A', color: '#F0E2C7' }
      }
    },
    {
      description: 'HELIO.HOODIE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmcNBdgCFbmFfc6WVJwNv8naMwuxckuABkQrQUPrdbHWzB',
      name: 'HELIO',
      properties: {
        rarity: 'rare',
        dependencies: ['1-4000'],
        shopifyId: 'SOME_SHOPIFY_ID',
        id: '2-2000'
      },
      attributes: {
        tags: ['hoodie', 'heavy-cotton', 'oversized'],
        theme: { bg: '#800080', altBg: '#2f4f4f', color: '#38373d' }
      }
    }
  ],
  [
    // COLLECTION 3
    {
      description: 'CRY.HOODIE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmPA7TbY6VS4Y3tMawXnhNj3bLtTKotMEdbjEcbF4vUwH7',
      name: 'CRY',
      properties: {
        rarity: 'common',
        dependencies: [],
        shopifyId: '6758874447923',
        id: '3-1000'
      }
    },
    {
      description: 'TREEGLIDE.TEE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmQoQRBM7JTfYHb2skR2UWxrvauiP7iLMrc2eyAvcVhb7e',
      name: 'TREEGLIDE',
      properties: {
        rarity: 'common',
        dependencies: [],
        shopifyId: '6758884540467',
        id: '3-2000'
      }
    },
    {
      description: 'SALT.TEE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmWB53TDta1wDjMvSCsRtqN3JNZgCnVcp8U6V1Q6t6eDUm',
      name: 'SALT',
      properties: {
        rarity: 'common',
        dependencies: [],
        shopifyId: '6758853771315',
        id: '3-3000'
      }
    },

    {
      description: 'FADEBLACK.TEE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmPTYa4M3dsPQiYDeDfsVu23EmcRx1gxYsX7sVzdwaFz64',
      name: 'FADEBLACK',
      properties: {
        rarity: 'common',
        dependencies: [],
        shopifyId: '6758881984563',
        id: '3-4000'
      },
      attributes: {
        css: 'transform: scale(1.3);',
        tags: ['shortsleeve', 'heavy-cotton', 'oversized'],
        theme: { bg: '#2A1927', altBg: '#2C2C2C', color: '#1e1e1e' }
      }
    },
    {
      description: 'GHOSTWHITE.LONGSLEEVE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmVpR9pRosyx6BePoyf2Vc9mK3CtnL2kni4eGSJcLYSRmP',
      name: 'GHOSTWHITE',
      properties: {
        rarity: 'common',
        dependencies: [],
        shopifyId: '6755479486515',
        id: '3-5000'
      }
    }
  ],
  // COLLECTION 4
  [
    {
      description: 'TRANSCENDANCE.LONGSLEEVE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmPA7TbY6VS4Y3tMawXnhNj3bLtTKotMEdbjEcbF4vUwH7',
      name: 'TRANSCENDANCE',
      properties: {
        rarity: 'legendary',
        dependencies: ['1-2000', '1-4000', '1-6000', '2-2000', '2-1000', '3-2000', '3-3000', '3-4000'],
        shopifyId: '6758874447923',
        id: '4-1000'
      }
    },

    {
      description: 'SENTIENCE.HOODIE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmQoQRBM7JTfYHb2skR2UWxrvauiP7iLMrc2eyAvcVhb7e',
      name: 'SENTIENCE',
      properties: {
        rarity: 'rare',
        dependencies: ['3-2000', '3-3000'],
        shopifyId: '6758884540467',
        id: '4-2000'
      }
    },

    {
      description: 'TURBOLAG.HOODIE.OVERSIZED.HEAVY-COTTON.',
      image: 'ipfs://QmWB53TDta1wDjMvSCsRtqN3JNZgCnVcp8U6V1Q6t6eDUm',
      name: 'TURBOLAG',
      properties: {
        rarity: 'epic',
        dependencies: ['3-1000', '3-2000', '3-4000', '4-1000'],
        shopifyId: '6758853771315',
        id: '4-3000'
      }
    }
  ]
  // COLLECTION 5
  // [
  //   {
  //     description: 'ASCENDANCE.HOODIE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmPA7TbY6VS4Y3tMawXnhNj3bLtTKotMEdbjEcbF4vUwH7',
  //     name: 'ASCENDANCE',
  //     properties: {
  //       rarity: 'common',
  //       dependencies: [],
  //       shopifyId: '6758874447923',
  //       id: '5-1000',
  //     },
  //   },
  //   {
  //     description: 'DAYDREAMING.TEE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmQoQRBM7JTfYHb2skR2UWxrvauiP7iLMrc2eyAvcVhb7e',
  //     name: 'DAYDREAMING',
  //     properties: {
  //       rarity: 'common',
  //       dependencies: [],
  //       shopifyId: '6758884540467',
  //       id: '5-2000',
  //     },
  //   },
  //   {
  //     description: 'ELLEX.TEE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmWB53TDta1wDjMvSCsRtqN3JNZgCnVcp8U6V1Q6t6eDUm',
  //     name: 'ELLEX',
  //     properties: {
  //       rarity: 'common',
  //       dependencies: [],
  //       shopifyId: '6758853771315',
  //       id: '5-3000',
  //     },
  //   },
  //   {
  //     description: 'REBIRTH.TEE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmPTYa4M3dsPQiYDeDfsVu23EmcRx1gxYsX7sVzdwaFz64',
  //     name: 'REBIRTH',
  //     properties: {
  //       rarity: 'common',
  //       dependencies: [],
  //       shopifyId: '6758881984563',
  //       id: '5-4000',
  //     },
  //     attributes: {
  //      css: "transform: scale(1.3);",
  //      tags: ['shortsleeve', 'heavy-cotton', 'oversized'],
  //      theme: { bg: '#2A1927', altBg: '#2C2C2C', color: '#1e1e1e' }
  //    }
  //   },
  //   {
  //     description: 'VIRGIL.LONGSLEEVE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmVpR9pRosyx6BePoyf2Vc9mK3CtnL2kni4eGSJcLYSRmP',
  //     name: 'VIRGIL',
  //     properties: {
  //       rarity: 'common',
  //       dependencies: [],
  //       shopifyId: '6755479486515',
  //       id: '5-5000',
  //     },
  //   },
  //   {
  //     description: 'VOODOO.LONGSLEEVE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmSv543U145S855s6XtT6DKUJojNwAbmN6QNwQL5Vk7bKV',
  //     name: 'VOODOO',
  //     properties: {
  //       rarity: 'common',
  //       dependencies: [],
  //       shopifyId: '6758852821043',
  //       id: '5-6000',
  //     },
  //   },
  // ],
  // COLLECTION 6
  // [
  //   {
  //     description: 'GODLY.LONGSLEEVE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmPTYa4M3dsPQiYDeDfsVu23EmcRx1gxYsX7sVzdwaFz64',
  //     name: 'GODLY',
  //     properties: {
  //       rarity: 'rare',
  //       dependencies: ['1-1000', '1-3000', '1-4000'],
  //       shopifyId: 'SOME_SHOPIFY_ID',
  //       id: '6-1000',
  //     },
  //     attributes: {
  //      css: "transform: scale(1.3);",
  //      tags: ['shortsleeve', 'heavy-cotton', 'oversized'],
  //      theme: { bg: '#2A1927', altBg: '#2C2C2C', color: '#1e1e1e' }
  //    }
  //   },
  //   {
  //     description: 'NIGHTMARE.HOODIE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmVpR9pRosyx6BePoyf2Vc9mK3CtnL2kni4eGSJcLYSRmP',
  //     name: 'NIGHTMARE',
  //     properties: {
  //       rarity: 'epic',
  //       dependencies: ['1-5000', '1-1000'],
  //       shopifyId: 'SOME_SHOPIFY_ID',
  //       id: '6-2000',
  //     },
  //   },

  // ],
  // COLLECTION 7
  // [
  //   {
  //     description: 'CRY.HOODIE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmPA7TbY6VS4Y3tMawXnhNj3bLtTKotMEdbjEcbF4vUwH7',
  //     name: 'CRY',
  //     properties: {
  //       rarity: 'common',
  //       dependencies: [],
  //       shopifyId: '6758874447923',
  //       id: '7-1000',
  //     },
  //   },
  //   {
  //     description: 'TREEGLIDE.TEE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmQoQRBM7JTfYHb2skR2UWxrvauiP7iLMrc2eyAvcVhb7e',
  //     name: 'TREEGLIDE',
  //     properties: {
  //       rarity: 'common',
  //       dependencies: [],
  //       shopifyId: '6758884540467',
  //       id: '7-2000',
  //     },
  //   },
  //   {
  //     description: 'SALT.TEE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmWB53TDta1wDjMvSCsRtqN3JNZgCnVcp8U6V1Q6t6eDUm',
  //     name: 'SALT',
  //     properties: {
  //       rarity: 'common',
  //       dependencies: [],
  //       shopifyId: '6758853771315',
  //       id: '7-3000',
  //     },
  //   },

  //   {
  //     description: 'FADEBLACK.TEE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmPTYa4M3dsPQiYDeDfsVu23EmcRx1gxYsX7sVzdwaFz64',
  //     name: 'FADEBLACK',
  //     properties: {
  //       rarity: 'common',
  //       dependencies: [],
  //       shopifyId: '6758881984563',
  //       id: '7-4000',
  //     },
  //      attributes: {
  //        css: "transform: scale(1.3);",
  //        tags: ['shortsleeve', 'heavy-cotton', 'oversized'],
  //        theme: { bg: '#2A1927', altBg: '#2C2C2C', color: '#1e1e1e' }
  //      }
  //   },
  //   {
  //     description: 'GHOSTWHITE.LONGSLEEVE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmVpR9pRosyx6BePoyf2Vc9mK3CtnL2kni4eGSJcLYSRmP',
  //     name: 'GHOSTWHITE',
  //     properties: {
  //       rarity: 'common',
  //       dependencies: [],
  //       shopifyId: '6755479486515',
  //       id: '7-5000',
  //     },
  //   },
  // ],
  // COLLECTION 8
  // [
  //   {
  //     description: 'TRANSCENDANCE.LONGSLEEVE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmPA7TbY6VS4Y3tMawXnhNj3bLtTKotMEdbjEcbF4vUwH7',
  //     name: 'TRANSCENDANCE',
  //     properties: {
  //       rarity: 'legendary',
  //       dependencies: ['5-1000', '5-3000', '5-6000', '4-1000', '4-2000', '7-1000'],
  //       shopifyId: '6758874447923',
  //       id: '8-1000',
  //     },
  //   },

  //   {
  //     description: 'SENTIENCE.HOODIE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmQoQRBM7JTfYHb2skR2UWxrvauiP7iLMrc2eyAvcVhb7e',
  //     name: 'SENTIENCE',
  //     properties: {
  //       rarity: 'rare',
  //       dependencies: ['3-2000', '3-3000'],
  //       shopifyId: '6758884540467',
  //       id: '8-2000',
  //     },
  //   },
  //   {
  //     description: 'TURBOLAG.HOODIE.OVERSIZED.HEAVY-COTTON.',
  //     image: 'ipfs://QmWB53TDta1wDjMvSCsRtqN3JNZgCnVcp8U6V1Q6t6eDUm',
  //     name: 'TURBOLAG',
  //     properties: {
  //       rarity: 'epic',
  //       get dependencies() {
  //         return [...METADATA[7][0].properties.dependencies, '6-2000']
  //       },
  //       shopifyId: '6758853771315',
  //       id: '8-3000',
  //     },
  //   },
  // ],
]

export default METADATA
