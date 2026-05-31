import { useState } from 'react'
import { abilityModifier, ABILITY_ABBR, formatModifier } from '../../data/abilities'
import { getClass } from '../../data/classes'
import { getSubclass } from '../../data/subclasses'
import { getLineage } from '../../data/lineages'
import { getHeritage } from '../../data/heritages'
import { computeAC } from '../../data/armor'
import { WEAPONS, getWeapon } from '../../data/weapons'
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

  // weapons the player bought, for a quick "equip" shortcut
  const purchasedWeaponIds = character.purchases
    .map((p) => p.id)
    .filter((id) => getWeapon(id) && !character.equippedWeapons.includes(id))

  function toggleWeapon(id: string) {
    const cur = character.equippedWeapons
    patch({ equippedWeapons: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] })
  }

  const q = query.trim().toLowerCase()
  const list = WEAPONS.filter((w) => !q || w.name.toLowerCase().includes(q))

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

      <h3>Equip weapons</h3>
      {purchasedWeaponIds.length > 0 && (
        <button
          className="secondary small"
          onClick={() =>
            patch({ equippedWeapons: [...new Set([...character.equippedWeapons, ...purchasedWeaponIds])] })
          }
        >
          Equip purchased weapons ({purchasedWeaponIds.length})
        </button>
      )}
      <input
        type="search"
        placeholder="Filter weapons…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="weapon-filter"
      />
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

      <SpecialAbilities character={character} />
    </div>
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
