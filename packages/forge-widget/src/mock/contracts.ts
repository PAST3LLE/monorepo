import { Address } from 'abitype'

export const CONTRACT_COLLECTIONS = {
  async getUri(id: number) {
    return `ipfs://QwdAdkjnafAfbiasf1289asfdabAkfbaksfb/${id}`
  },
  async getSkillsAddress(id: number): Promise<Address> {
    return `0xaaaaaaaabbbbbbxxccccccc000${id}`
  },
  async totalSupply() {
    const amt = Object.keys(COLLECTION_CONTRACTS_MAP).length - 1
    return {
      toNumber() {
        return amt
      },
      toString() {
        return amt.toString()
      }
    }
  }
}

export const CONTRACT_SKILLS_1 = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async uri(_id: number) {
    return '/1/{id}.json'
  },
  async getCollectionId() {
    const id = 1
    return {
      toString() {
        return id.toString()
      },
      toNumber() {
        return id
      }
    }
  },
  async getCollectionAddress(): Promise<Address> {
    return '0xaaaaaaaaaaaaaaaaaaaaaaaa0001'
  }
}
export const CONTRACT_SKILLS_2 = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async uri(_id: number) {
    return '/2/{id}.json'
  },
  async getCollectionId() {
    const id = 2
    return {
      toString() {
        return id.toString()
      },
      toNumber() {
        return id
      }
    }
  },
  async getCollectionAddress(): Promise<Address> {
    return '0xaaaaaaaaaaaaaaaaaaaaaaaa0002'
  }
}
export const CONTRACT_SKILLS_3 = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async uri(_id: number) {
    return '/3/{id}.json'
  },
  async getCollectionId() {
    const id = 3
    return {
      toString() {
        return id.toString()
      },
      toNumber() {
        return id
      }
    }
  },
  async getCollectionAddress(): Promise<Address> {
    return '0xaaaaaaaaaaaaaaaaaaaaaaaa0003'
  }
}

export const COLLECTION_CONTRACTS_MAP = {
  CONTRACT_COLLECTIONS,
  CONTRACT_SKILLS_1,
  CONTRACT_SKILLS_2,
  CONTRACT_SKILLS_3
}

const SKILLS_CONTRACT_MAP: {
  [key: `0x${string}`]: typeof CONTRACT_SKILLS_1
} = {
  ['0xaaaaaaaabbbbbbxxccccccc0001']: COLLECTION_CONTRACTS_MAP.CONTRACT_SKILLS_1,
  ['0xaaaaaaaabbbbbbxxccccccc0002']: COLLECTION_CONTRACTS_MAP.CONTRACT_SKILLS_2,
  ['0xaaaaaaaabbbbbbxxccccccc0003']: COLLECTION_CONTRACTS_MAP.CONTRACT_SKILLS_3
}

export async function mockGetContract(address: `0x${string}`) {
  return SKILLS_CONTRACT_MAP[address]
}
