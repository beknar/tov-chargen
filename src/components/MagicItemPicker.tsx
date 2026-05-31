import { useState } from 'react'
import { MAGIC_ITEMS, RARITY_ORDER } from '../data/magicItems'
import { useCharacter } from '../state/CharacterContext'

export function MagicItemPicker() {
  const { character, patch } = useCharacter()
  const [query, setQuery] = useState('')
  const selected = character.magicItems

  function toggle(id: string) {
    patch({
      magicItems: selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    })
  }

  const q = query.trim().toLowerCase()
  const matches = MAGIC_ITEMS.filter((i) => !q || i.name.toLowerCase().includes(q))
    .slice()
    .sort(
      (a, b) =>
        RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity) ||
        a.name.localeCompare(b.name),
    )

  return (
    <details className="magic-items">
      <summary>
        Magic items <span className="muted">(optional — {selected.length} added)</span>
      </summary>
      <p className="muted feature-note">
        Magic items aren’t standard at 1st level, but add any your GM grants.
      </p>
      <input
        type="search"
        placeholder="Filter magic items…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mi-list">
        {matches.slice(0, q ? matches.length : 60).map((item) => {
          const on = selected.includes(item.id)
          return (
            <details key={item.id} className={`mi-item ${on ? 'on' : ''}`}>
              <summary>
                <button
                  className={`spell-select ${on ? 'on' : ''}`}
                  aria-pressed={on}
                  onClick={(e) => {
                    e.preventDefault()
                    toggle(item.id)
                  }}
                >
                  {on ? '✓' : '+'}
                </button>
                <span className="mi-name">{item.name}</span>
                <span className={`mi-rarity r-${item.rarity.replace(' ', '-')}`}>{item.rarity}</span>
              </summary>
              <p className="mi-meta">
                {item.type}
                {item.attunement ? ' · requires attunement' : ''}
              </p>
              <p className="spell-text">{item.text}</p>
            </details>
          )
        })}
        {!q && matches.length > 60 && (
          <p className="muted feature-note">Showing 60 of {matches.length} — filter to see more.</p>
        )}
      </div>
    </details>
  )
}
