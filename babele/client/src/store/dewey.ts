import { DeweyCategory } from '@sidmonta/babelelibrary/build/types'
import { fetchAPI } from '../services'
import { atom, selectorFamily, useRecoilValue } from 'recoil'

const getDewey = fetchAPI('GET')

export const deweySelected = atom<DeweyCategory | null>({
  key: 'dewey-selected',
  default: null,
})

export const deweySelect = selectorFamily({
  key: 'dewey-select',
  get: (fallback: string) => async ({ get }) => {
    let dewey = get(deweySelected)
    if (!dewey || fallback) {
      dewey = (await getDewey('/get-dewey/' + fallback))[0] as DeweyCategory | null
    }
    return dewey
  },
})

export const useDewey = (deweyId: string) => useRecoilValue(deweySelect(deweyId))
