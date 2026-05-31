import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react'
import { freshCharacter, sanitizeCharacter, type Character } from './types'

const STORAGE_KEY = 'tov-chargen:character'

type Action = { type: 'patch'; patch: Partial<Character> } | { type: 'reset' }

function reducer(state: Character, action: Action): Character {
  switch (action.type) {
    case 'patch':
      return { ...state, ...action.patch }
    case 'reset':
      return freshCharacter()
  }
}

function loadInitial(): Character {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    // sanitizeCharacter fills missing fields from defaults and drops bad data.
    if (raw) return sanitizeCharacter(JSON.parse(raw))
  } catch {
    // Corrupt or unavailable storage — fall back to a fresh character.
  }
  return freshCharacter()
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
