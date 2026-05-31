import { useRef } from 'react'
import {
  ABILITIES,
  ABILITY_ABBR,
  ABILITY_NAME,
  abilityModifier,
  formatModifier,
  type Ability,
} from '../../data/abilities'
import { getClass } from '../../data/classes'
import { getSubclass } from '../../data/subclasses'
import { computeAC } from '../../data/armor'
import { getLineage } from '../../data/lineages'
import { getHeritage } from '../../data/heritages'
import { getBackground } from '../../data/backgrounds'
import { getTalent } from '../../data/talents'
import { SKILLS } from '../../data/skills'
import { INITIAL_CHARACTER, type Character } from '../../state/types'
import { useCharacter } from '../../state/CharacterContext'

const PROFICIENCY_BONUS = 2

function completeness(c: Character): string[] {
  const missing: string[] = []
  if (!c.name.trim()) missing.push('a name')
  if (!c.classId) missing.push('a class')
  if (!c.scoreMethod) missing.push('ability scores')
  if (!c.lineageId) missing.push('a lineage')
  if (!c.heritageId) missing.push('a heritage')
  if (!c.backgroundId) missing.push('a background')
  if (!c.talentId) missing.push('a talent')
  if (!c.equipmentMethod) missing.push('equipment')
  return missing
}

export function ReviewStep() {
  const { character, patch } = useCharacter()
  const fileRef = useRef<HTMLInputElement>(null)

  const cls = getClass(character.classId)
  const subclass = getSubclass(character.classId, character.subclassId)
  const lineage = getLineage(character.lineageId)
  const heritage = getHeritage(character.heritageId)
  const background = getBackground(character.backgroundId)
  const conMod = abilityModifier(character.abilityScores.con)
  const hp = cls ? cls.hitDie + conMod : null
  const ac = computeAC(character.abilityScores, character.classId, character.armorId, character.shield)
  const missing = completeness(character)

  const proficientSkills = new Set([...character.classSkills, ...character.backgroundSkills])
  const skillRows = SKILLS.map((sk) => {
    const prof = proficientSkills.has(sk.id)
    const bonus = abilityModifier(character.abilityScores[sk.ability]) + (prof ? PROFICIENCY_BONUS : 0)
    return { sk, prof, bonus }
  })

  function isProficientSave(a: Ability) {
    return cls?.savingThrows.includes(a) ?? false
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(character.name || 'character').replace(/[^\w-]+/g, '_')}.tov.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importJson(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as Partial<Character>
        if (data && typeof data === 'object') {
          patch({ ...INITIAL_CHARACTER, ...data })
        }
      } catch {
        alert('That file is not a valid character export.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="review-step">
      {missing.length > 0 && (
        <p className="review-warning" role="status">
          Still to choose: {missing.join(', ')}. You can finish anyway and fill these in later.
        </p>
      )}

      <div className="actions no-print">
        <button className="primary" onClick={exportJson}>
          Export JSON
        </button>
        <button className="secondary" onClick={() => window.print()}>
          Print / Save PDF
        </button>
        <button className="secondary" onClick={() => fileRef.current?.click()}>
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) importJson(f)
            e.target.value = ''
          }}
        />
      </div>

      <article className="character-sheet">
        <header className="sheet-head">
          <h2>{character.name || 'Unnamed Character'}</h2>
          <p className="sheet-sub">
            {[lineage?.name, heritage?.name, cls?.name].filter(Boolean).join(' · ') || '—'}
            {background ? ` — ${background.name}` : ''}
          </p>
          {character.concept && <p className="sheet-concept">{character.concept}</p>}
        </header>

        <section className="sheet-block">
          <h3>Abilities</h3>
          <table className="sheet-abilities">
            <thead>
              <tr>
                <th scope="col">Ability</th>
                <th scope="col">Score</th>
                <th scope="col">Mod</th>
                <th scope="col">Save</th>
              </tr>
            </thead>
            <tbody>
              {ABILITIES.map((a) => {
                const score = character.abilityScores[a]
                const mod = abilityModifier(score)
                const prof = isProficientSave(a)
                const save = mod + (prof ? PROFICIENCY_BONUS : 0)
                return (
                  <tr key={a}>
                    <th scope="row">{ABILITY_NAME[a]}</th>
                    <td>{score}</td>
                    <td>{formatModifier(mod)}</td>
                    <td className={prof ? 'prof' : ''}>
                      {formatModifier(save)}
                      {prof && <span className="prof-dot" title="Proficient" />}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        <section className="sheet-block sheet-stats">
          <div>
            <span className="stat-label">Hit Points</span>
            <span className="stat-value">{hp ?? '—'}</span>
          </div>
          <div>
            <span className="stat-label">Armor Class</span>
            <span className="stat-value">{ac.ac}</span>
          </div>
          <div>
            <span className="stat-label">Hit Die</span>
            <span className="stat-value">{cls ? `d${cls.hitDie}` : '—'}</span>
          </div>
          <div>
            <span className="stat-label">Proficiency</span>
            <span className="stat-value">{formatModifier(PROFICIENCY_BONUS)}</span>
          </div>
          <div>
            <span className="stat-label">Speed</span>
            <span className="stat-value">{lineage ? `${lineage.speed} ft` : '—'}</span>
          </div>
          {character.gold !== null && (
            <div>
              <span className="stat-label">Gold</span>
              <span className="stat-value">{character.gold} gp</span>
            </div>
          )}
        </section>

        <section className="sheet-block">
          <h3>Skills</h3>
          <ul className="skill-sheet">
            {skillRows.map(({ sk, prof, bonus }) => (
              <li key={sk.id} className={prof ? 'prof' : ''}>
                <span className="skill-sheet-bonus">{formatModifier(bonus)}</span>
                <span className="skill-sheet-name">
                  {prof && <span className="prof-dot" title="Proficient" />}
                  {sk.name}
                </span>
                <span className="skill-sheet-ability">{ABILITY_ABBR[sk.ability]}</span>
              </li>
            ))}
          </ul>
        </section>

        {cls && (
          <section className="sheet-block">
            <h3>
              Class — {cls.name}
              {subclass ? ` (${subclass.name})` : ''}
            </h3>
            <ul className="sheet-kv">
              <li>
                <strong>Armor:</strong> {cls.proficiencies.armor || '—'}
              </li>
              <li>
                <strong>Weapons:</strong> {cls.proficiencies.weapons || '—'}
              </li>
              <li>
                <strong>Tools:</strong> {cls.proficiencies.tools || '—'}
              </li>
              <li>
                <strong>Saves:</strong> {cls.savingThrows.map((a) => ABILITY_ABBR[a]).join(', ')}
              </li>
            </ul>
            {cls.features.length > 0 && (
              <dl className="sheet-features">
                {cls.features.map((f) => (
                  <div key={f.name}>
                    <dt>{f.name}</dt>
                    <dd>{f.text}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        )}

        {lineage && (
          <section className="sheet-block">
            <h3>Lineage — {lineage.name}</h3>
            <p className="muted">
              Size {lineage.size} · Speed {lineage.speed} ft
            </p>
            <dl className="sheet-features">
              {lineage.traits.map((t) => (
                <div key={t.name}>
                  <dt>{t.name}</dt>
                  <dd>{t.text}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {heritage && (
          <section className="sheet-block">
            <h3>Heritage — {heritage.name}</h3>
            <dl className="sheet-features">
              {heritage.traits.map((t) => (
                <div key={t.name}>
                  <dt>{t.name}</dt>
                  <dd>{t.text}</dd>
                </div>
              ))}
              {heritage.languages && (
                <div>
                  <dt>Languages</dt>
                  <dd>{heritage.languages}</dd>
                </div>
              )}
            </dl>
          </section>
        )}

        {background && (
          <section className="sheet-block">
            <h3>Background — {background.name}</h3>
            <ul className="sheet-kv">
              {background.additional && (
                <li>
                  <strong>Also:</strong> {background.additional}
                </li>
              )}
              {character.talentId && (
                <li>
                  <strong>Talent:</strong> {character.talentId}
                  {getTalent(character.talentId) ? ` — ${getTalent(character.talentId)}` : ''}
                </li>
              )}
            </ul>
          </section>
        )}

        {character.equipmentMethod && (
          <section className="sheet-block">
            <h3>Equipment</h3>
            {character.equipmentMethod === 'granted' ? (
              <>
                {cls && (
                  <ul className="sheet-kv">
                    {cls.startingEquipment.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {background && <p>{background.equipment}</p>}
              </>
            ) : (
              <p>Starting wealth: {character.gold !== null ? `${character.gold} gp` : 'not yet rolled'}</p>
            )}
          </section>
        )}
      </article>
    </div>
  )
}
