import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react'
import { INITIAL_CHARACTER, type Character } from './types'

const STORAGE_KEY = 'tov-chargen:character'

type Action = { type: 'patch'; patch: Partial<Character> } | { type: 'reset' }

function reducer(state: Character, action: Action): Character {
  switch (action.type) {
    case 'patch':
      return { ...state, ...action.patch }
    case 'reset':
      return { ...INITIAL_CHARACTER, abilityScores: { ...INITIAL_CHARACTER.abilityScores } }
  }
}

function loadInitial(): Character {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      // Shallow-merge over defaults so new fields added later don't break old saves.
      return { ...INITIAL_CHARACTER, ...(JSON.parse(raw) as Partial<Character>) }
    }
  } catch {
    // Corrupt or unavailable storage — fall back to a fresh character.
  }
  return { ...INITIAL_CHARACTER, abilityScores: { ...INITIAL_CHARACTER.abilityScores } }
}

interface CharacterStore {
  character: Character
  patch: (patch: Partial<Character>) => void
  reset: () => void
}

const CharacterCtx = createContext<CharacterStore | null>(null)

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [character, dispatch] = useReducer(reducer, undefined, loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(character))
    } catch {
      // Ignore storage write failures (e.g. private mode quota).
    }
  }, [character])

  const patch = useCallback((p: Partial<Character>) => dispatch({ type: 'patch', patch: p }), [])
  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    dispatch({ type: 'reset' })
  }, [])

  return (
    <CharacterCtx.Provider value={{ character, patch, reset }}>{children}</CharacterCtx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCharacter(): CharacterStore {
  const ctx = useContext(CharacterCtx)
  if (!ctx) throw new Error('useCharacter must be used within a CharacterProvider')
  return ctx
}
