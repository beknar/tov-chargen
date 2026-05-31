import { useState } from 'react'
import { abilityModifier, ABILITY_ABBR, formatModifier } from '../../data/abilities'
import { getClass } from '../../data/classes'
import { getSubclass } from '../../data/subclasses'
import { getLineage } from '../../data/lineages'
import { getHeritage } from '../../data/heritages'
import { computeAC, getArmor } from '../../data/armor'
import { WEAPONS, getWeapon } from '../../data/weapons'
import { getMagicItem } from '../../data/magicItems'
import { deriveInventory } from '../../data/inventory'
import { getTalent } from '../../data/talents'
import { unarmedStrike, weaponAttack, PB, type Attack } from '../../data/combat'
import { useCharacter } from '../../state/CharacterContext'
import type { Character } from '../../state/types'

export function CombatStep() {
  const { character, patch } = useCharacter()
  const [query, setQuery] = useState('')
  const cls = getClass(character.classId)

  const ac = computeAC(character.abilityScores, character.classId, character.armorId, character.shield)
  const conMod = abilityModifier(character.abilityScores.con)
  const dexMod = abilityModifier(character.abilityScores.dex)
  const hp = cls ? cls.hitDie + conMod : null
  const lineage = getLineage(character.lineageId)

  const equipped = character.equippedWeapons.map(getWeapon).filter((w): w is NonNullable<typeof w> => !!w)
  const attacks: Attack[] = [unarmedStrike(character), ...equipped.map((w) => weaponAttack(character, w))]

  const inv = deriveInventory(character)
  const [showAll, setShowAll] = useState(false)
  // Weapons kept visible in the picker: inventory + equipped + any toggled this
  // session, so unchecking a weapon never removes it as a choice.
  const [shown, setShown] = useState<string[]>(() => [
    ...new Set([...inv.weaponIds, ...character.equippedWeapons]),
  ])

  function toggleWeapon(id: string) {
    setShown((s) => (s.includes(id) ? s : [...s, id]))
    const cur = character.equippedWeapons
    patch({ equippedWeapons: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] })
  }

  const q = query.trim().toLowerCase()
  const available = WEAPONS.filter((w) => showAll || shown.includes(w.id))
  const list = available.filter((w) => !q || w.name.toLowerCase().includes(q))

  return (
    <div className="combat-step">
      <section className="stat-strip">
        <Stat label="Armor Class" value={ac.ac} sub={ac.source} />
        <Stat label="Hit Points" value={hp ?? '—'} />
        <Stat label="Initiative" value={formatModifier(dexMod)} />
        <Stat label="Proficiency" value={formatModifier(PB)} />
        <Stat label="Speed" value={lineage ? `${lineage.speed} ft` : '—'} />
      </section>

      <h3>Attacks</h3>
      <table className="attacks-table">
        <thead>
          <tr>
            <th scope="col">Attack</th>
            <th scope="col">Bonus</th>
            <th scope="col">Damage</th>
            <th scope="col">Range</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          {attacks.map((a) => (
            <tr key={a.name}>
              <th scope="row">
                {a.name} <span className="atk-ability">{ABILITY_ABBR[a.ability]}</span>
              </th>
              <td>
                {formatModifier(a.attackBonus)}
                {!a.proficient && <span className="not-prof" title="Not proficient"> *</span>}
              </td>
              <td>{a.damage}</td>
              <td>{a.range}</td>
              <td className="atk-props">{a.properties.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted feature-note">
        Attack bonus = ability modifier + proficiency (if proficient). “*” marks a weapon you
        aren’t proficient with (no proficiency bonus). Versatile damage shows the two-handed die.
      </p>

      <GearPanel
        inv={inv}
        armorId={character.armorId}
        shield={character.shield}
        onWear={(id) => patch({ armorId: character.armorId === id ? null : id })}
        onShield={(v) => patch({ shield: v })}
      />

      <h3>Equip weapons</h3>
      <p className="muted feature-note">
        Weapons from your inventory (class/background gear and purchases).{' '}
        <label className="show-all">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
          Show all weapons
        </label>
      </p>
      {available.length > 0 && (
        <input
          type="search"
          placeholder="Filter weapons…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="weapon-filter"
        />
      )}
      {available.length === 0 ? (
        <p className="muted">
          No specific weapons found in your inventory. Add weapons in the Equipment step, or tick
          “Show all weapons” to equip any (e.g. for a generic “martial weapon” grant).
        </p>
      ) : (
        <div className="weapon-pick">
          {list.map((w) => {
            const on = character.equippedWeapons.includes(w.id)
            return (
              <button
                key={w.id}
                className={`weapon-chip ${on ? 'on' : ''}`}
                aria-pressed={on}
                onClick={() => toggleWeapon(w.id)}
              >
                <span className="wc-name">{on ? '✓ ' : ''}{w.name}</span>
                <span className="wc-meta">
                  {w.damage} · {w.category} {w.kind}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <SpecialAbilities character={character} />
    </div>
  )
}

function GearPanel({
  inv,
  armorId,
  shield,
  onWear,
  onShield,
}: {
  inv: ReturnType<typeof deriveInventory>
  armorId: string | null
  shield: boolean
  onWear: (id: string) => void
  onShield: (value: boolean) => void
}) {
  const hasGear = inv.armorIds.length > 0 || inv.hasShield || inv.magicItemIds.length > 0
  if (!hasGear) return null
  return (
    <>
      <h3>Worn &amp; carried</h3>
      {(inv.armorIds.length > 0 || inv.hasShield) && (
        <p className="muted feature-note">Check armor or a shield to wear it — your AC updates above.</p>
      )}
      <ul className="gear-panel">
        {inv.armorIds.map((id) => {
          const a = getArmor(id)
          if (!a) return null
          const worn = id === armorId
          return (
            <li key={id}>
              <label className="gear-toggle">
                <input type="checkbox" checked={worn} onChange={() => onWear(id)} />
                <span>
                  {a.name} <span className="muted">(armor, AC {a.baseAC})</span>
                </span>
              </label>
              {worn && <span className="worn-tag">worn</span>}
            </li>
          )
        })}
        {inv.hasShield && (
          <li>
            <label className="gear-toggle">
              <input type="checkbox" checked={shield} onChange={(e) => onShield(e.target.checked)} />
              <span>
                Shield <span className="muted">(+2 AC)</span>
              </span>
            </label>
            {shield && <span className="worn-tag">worn</span>}
          </li>
        )}
        {inv.magicItemIds.map((id) => {
          const mi = getMagicItem(id)
          return mi ? (
            <li key={id}>
              {mi.name} <span className="muted">({mi.rarity}{mi.attunement ? ', attunement' : ''})</span>
            </li>
          ) : null
        })}
      </ul>
    </>
  )
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="stat-box">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {sub && <span className="ac-source">{sub}</span>}
    </div>
  )
}

function SpecialAbilities({ character }: { character: Character }) {
  const cls = getClass(character.classId)
  const subclass = getSubclass(character.classId, character.subclassId)
  const lineage = getLineage(character.lineageId)
  const heritage = getHeritage(character.heritageId)
  const talentText = getTalent(character.talentId)

  return (
    <>
      <h3>Features & Abilities</h3>
      <dl className="trait-list">
        {cls?.features.map((f) => (
          <div key={f.name} className="trait">
            <dt>{f.name}</dt>
            <dd>{f.text}</dd>
          </div>
        ))}
        {character.talentId && (
          <div className="trait">
            <dt>Talent: {character.talentId}</dt>
            <dd>{talentText ?? 'See the Player’s Guide.'}</dd>
          </div>
        )}
        {subclass && (
          <div className="trait">
            <dt>Subclass: {subclass.name}</dt>
            <dd>{subclass.flavor}</dd>
          </div>
        )}
      </dl>
      {(lineage || heritage) && (
        <p className="muted feature-note">
          Lineage/heritage traits
          {lineage ? ` — ${lineage.traits.map((t) => t.name).join(', ')}` : ''}
          {heritage ? `; ${heritage.traits.map((t) => t.name).join(', ')}` : ''} (full text on the
          Review sheet).
        </p>
      )}
    </>
  )
}
