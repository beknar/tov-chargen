import { useState } from 'react'
import { rollStartingGold } from '../../data/abilityScoreMethods'
import { getClass, type ClassDef } from '../../data/classes'
import { getBackground, type BackgroundDef } from '../../data/backgrounds'
import { ARMORS, computeAC } from '../../data/armor'
import { SHOP, getShopItem, gp, parseEquipmentOptions } from '../../data/shop'
import { useCharacter } from '../../state/CharacterContext'
import type { Character } from '../../state/types'

export function EquipmentStep() {
  const { character, patch } = useCharacter()
  const cls = getClass(character.classId)
  const background = getBackground(character.backgroundId)
  const method = character.equipmentMethod
  const ac = computeAC(character.abilityScores, character.classId, character.armorId, character.shield)

  return (
    <div className="equipment-step">
      <section className="armor-block">
        <h3>Armor & AC</h3>
        <div className="armor-controls">
          <label className="field">
            <span className="field-label">Armor</span>
            <select
              value={character.armorId ?? ''}
              onChange={(e) => patch({ armorId: e.target.value || null })}
            >
              <option value="">No armor (unarmored)</option>
              {(['light', 'medium', 'heavy'] as const).map((c) => (
                <optgroup key={c} label={`${c[0].toUpperCase()}${c.slice(1)} armor`}>
                  {ARMORS.filter((a) => a.category === c).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (AC {a.baseAC}
                      {a.category === 'light' ? ' + DEX' : a.category === 'medium' ? ' + DEX, max 2' : ''})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={character.shield}
              onChange={(e) => patch({ shield: e.target.checked })}
            />
            <span>Shield (+2)</span>
          </label>
          <div className="ac-badge">
            <span className="stat-label">Armor Class</span>
            <span className="stat-value">{ac.ac}</span>
            <span className="ac-source">{ac.source}</span>
          </div>
        </div>
      </section>

      <fieldset className="method-picker">
        <legend>Method</legend>
        <div className="method-options">
          <button
            role="radio"
            aria-checked={method === 'granted'}
            className={`choice-card compact ${method === 'granted' ? 'selected' : ''}`}
            onClick={() => patch({ equipmentMethod: 'granted' })}
          >
            <span className="choice-title">Take starting gear</span>
            <span className="choice-desc">Use the equipment from your class and background.</span>
          </button>
          <button
            role="radio"
            aria-checked={method === 'wealth'}
            className={`choice-card compact ${method === 'wealth' ? 'selected' : ''}`}
            onClick={() => patch({ equipmentMethod: 'wealth' })}
          >
            <span className="choice-title">Roll for wealth</span>
            <span className="choice-desc">Roll 5d4 × 10 gp and buy your own gear.</span>
          </button>
        </div>
      </fieldset>

      {method === 'granted' && <GrantedGear cls={cls} background={background} />}
      {method === 'wealth' && <Shop character={character} patch={patch} />}
      {!method && <p className="muted">Choose how to get your starting equipment.</p>}
    </div>
  )
}

// ---- Method 1: interactive (a)/(b) choices ----

function GrantedGear({ cls, background }: { cls?: ClassDef; background?: BackgroundDef }) {
  const { character, patch } = useCharacter()
  if (!cls && !background) {
    return <p className="muted">Choose a class and background first to see your starting gear.</p>
  }

  function choose(lineIndex: number, optIndex: number) {
    patch({ equipmentChoices: { ...character.equipmentChoices, [lineIndex]: optIndex } })
  }

  return (
    <div className="score-editor">
      {cls && (
        <>
          <h3>{cls.name} equipment</h3>
          <ul className="grant-list">
            {cls.startingEquipment.map((line, i) => {
              const opts = parseEquipmentOptions(line)
              if (opts.length === 1) return <li key={i} className="grant-fixed">{opts[0]}</li>
              const chosen = character.equipmentChoices[i] ?? 0
              return (
                <li key={i} className="grant-choice" role="radiogroup" aria-label={`Choice ${i + 1}`}>
                  {opts.map((opt, oi) => (
                    <button
                      key={oi}
                      role="radio"
                      aria-checked={chosen === oi}
                      className={`opt-chip ${chosen === oi ? 'on' : ''}`}
                      onClick={() => choose(i, oi)}
                    >
                      <span className="opt-letter">{String.fromCharCode(97 + oi)}</span>
                      {opt}
                    </button>
                  ))}
                </li>
              )
            })}
          </ul>
        </>
      )}
      {background && (
        <>
          <h3>{background.name} equipment</h3>
          <p>{background.equipment}</p>
        </>
      )}
    </div>
  )
}

// ---- Method 2: buyable shop ----

function Shop({ character, patch }: { character: Character; patch: (p: Partial<Character>) => void }) {
  const [query, setQuery] = useState('')

  if (character.gold === null) {
    return (
      <div className="score-editor">
        <button className="primary" onClick={() => patch({ gold: rollStartingGold() })}>
          🎲 Roll starting gold (5d4 × 10 gp)
        </button>
        <p className="muted">Rolls your starting wealth, then opens the shop.</p>
      </div>
    )
  }

  const spent = character.purchases.reduce(
    (s, p) => s + (getShopItem(p.id)?.costGp ?? 0) * p.qty,
    0,
  )
  const remaining = character.gold - spent
  const qtyOf = (id: string) => character.purchases.find((p) => p.id === id)?.qty ?? 0

  function setQty(id: string, qty: number) {
    const others = character.purchases.filter((p) => p.id !== id)
    patch({ purchases: qty > 0 ? [...others, { id, qty }] : others })
  }

  const q = query.trim().toLowerCase()

  return (
    <div className="score-editor shop">
      <div className="shop-bar">
        <div className="wallet">
          <span>Gold <strong>{gp(character.gold)}</strong></span>
          <span>Spent <strong>{gp(spent)}</strong></span>
          <span className={remaining < 0 ? 'over' : ''}>
            Remaining <strong>{gp(remaining)}</strong>
          </span>
          <button className="secondary small" onClick={() => patch({ gold: rollStartingGold(), purchases: [] })}>
            Re-roll
          </button>
        </div>
        <input
          type="search"
          placeholder="Filter items…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {remaining < 0 && <p className="over feature-note">You’ve overspent by {gp(-remaining)}.</p>}

      {SHOP.map((cat) => {
        const items = cat.items.filter((i) => !q || i.name.toLowerCase().includes(q))
        if (items.length === 0) return null
        return (
          <div key={cat.name} className="shop-cat">
            <h4>{cat.name}</h4>
            <ul className="shop-list">
              {items.map((item) => {
                const qty = qtyOf(item.id)
                const affordable = remaining - item.costGp >= 0
                return (
                  <li key={item.id} className={qty > 0 ? 'in-cart' : ''}>
                    <span className="shop-name">
                      {item.name}
                      {item.note && <span className="shop-note"> · {item.note}</span>}
                    </span>
                    <span className="shop-price">{gp(item.costGp)}</span>
                    <span className="shop-qty">
                      <button aria-label={`Remove one ${item.name}`} disabled={qty === 0} onClick={() => setQty(item.id, qty - 1)}>
                        −
                      </button>
                      <span>{qty}</span>
                      <button
                        aria-label={`Add one ${item.name}`}
                        disabled={!affordable}
                        onClick={() => setQty(item.id, qty + 1)}
                      >
                        +
                      </button>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
