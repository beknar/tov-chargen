// Talent descriptions (Player's Guide, Chapter 4). Keyed by talent name.
// These are the talents offered as background choices; descriptions are short
// best-effort summaries from the rules reference — see the Player's Guide for
// full benefits and prerequisites.

export const TALENTS: Record<string, string> = {
  "Artillerist": "Prerequisite: STR 13 or Higher You trained to master complex ranged weapons.",
  "Aware": "You have exceptional situational awareness.",
  "Combat Casting": "Experience on the battlefield has given you superior focus to cast your spells.",
  "Combat Conditioning": "You’ve endured extensive training to withstand the rigors of combat.",
  "Comrade": "You excel while helping others.",
  "Covert": "Prerequisite: Proficiency with the Stealth Skill, DEX 13 or Higher You trained in the art of espionage.",
  "Dungeoneer": "You’ve studied—or at least survived—your share of hazards and learned a thing or two about sniffing out secrets.",
  "Far Traveler": "You have traveled the world and been to many fantastical places.",
  "Field Medic": "You trained to provide emergency medical assistance.",
  "Hand to Hand": "You mastered techniques that allow you to efficiently fight barehanded.",
  "Mental Fortitude": "Through rigid mental exercise, you have fortified yourself against mind-altering effects.",
  "Opportunist": "You find openings in your targets’ defenses.",
  "Physical Fortitude": "You’ve fortified yourself against physically debilitating effects.",
  "Polyglot": "You have studied language extensively.",
  "Quick": "Strike Martial Action. When you take the Attack action and hit a creature, the bonus attack granted by two-weapon fighting deals additional damage equal to your PB against that creature.",
  "Ritualist": "Prerequisite: Spellcasting Class Feature Your study of magic has unlocked the mysteries of ritual spells.",
  "School Specialization": "Choose one of the eight schools of magic: abjuration, conjuration, divination, enchantment, evocation, illusion, necromancy, or transmutation.",
  "Scrutinous": "You have a keen eye for detail.",
  "Touch of Luck": "Fortune’s favor always makes its way back to you.",
  "Trade Skills": "You honed your skills to work in a particular profession."
}

export function getTalent(name: string | null): string | undefined {
  return name ? TALENTS[name] : undefined
}
