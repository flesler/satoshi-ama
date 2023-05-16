import json from './qas.json'

interface QA {
  q: string
  a: string
}

export const qas: QA[] = json