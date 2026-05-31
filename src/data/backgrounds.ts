// The 10 backgrounds (Player's Guide, Chapter 4: Backgrounds and Talents).
// A background grants skill proficiencies, additional proficiencies/languages,
// starting equipment, and a choice of one talent from a short list.
// Extracted from the rules reference.

export interface BackgroundDef {
  id: string
  name: string
  flavor: string
  skills: string
  /** Additional proficiencies and/or languages. */
  additional: string
  languages: string
  equipment: string
  /** The player chooses one of these talents (see talents.ts). */
  talentChoices: string[]
}

export const BACKGROUNDS: BackgroundDef[] = [
  {
    "id": "adherent",
    "name": "Adherent",
    "flavor": "Before you began adventuring, you committed yourself to a faith, belief, or cause.",
    "skills": "Choose two from History, Investigation, Religion, or Persuasion.",
    "additional": "Gain proficiency with artist’s tools and an additional tool of your choice.",
    "languages": "",
    "equipment": "A prayer book or ceremonial dagger, a holy symbol, a block of fragrant incense, vestments, a set of common clothes, and a pouch containing 10 gp.",
    "talentChoices": [
      "Field Medic",
      "Mental Fortitude",
      "Ritualist"
    ]
  },
  {
    "id": "artist",
    "name": "Artist",
    "flavor": "You doggedly practiced artistic pursuits before taking up the adventuring life.",
    "skills": "Choose two from Acrobatics, Insight, Performance, or Persuasion.",
    "additional": "Learn one additional language of your choice and gain proficiency with one tool representative of your artistic pursuits.",
    "languages": "",
    "equipment": "A musical instrument or tool you are proficient with, a steel mirror, a set of fine clothes, an ink pen and bottle of ink, and a coin purse containing 4 gp.",
    "talentChoices": [
      "Quick",
      "Scrutinous",
      "Trade Skills"
    ]
  },
  {
    "id": "courtier",
    "name": "Courtier",
    "flavor": "You spent a great deal of time in a royal court.",
    "skills": "Choose two from History, Religion, Insight, or Deception.",
    "additional": "Learn one additional language of your choice and gain proficiency with either artist’s tools or navigator’s tools and a musical instrument of your choice.",
    "languages": "",
    "equipment": "A writ of nobility or patronage from a noble, signet ring, a set of fine clothes, and a coin purse containing 12 gp.",
    "talentChoices": [
      "Combat Conditioning",
      "Mental Fortitude",
      "Polyglot"
    ]
  },
  {
    "id": "criminal",
    "name": "Criminal",
    "flavor": "You were a cutpurse, grifter, thief, or assassin. Surviving in the criminal underworld while plying your nefarious trade taught you patience, resourcefulness, and careful planning.",
    "skills": "Choose two from Stealth, Investigation, Insight, or Deception.",
    "additional": "You know Thieves’ Cant. If you already know this language, you learn a different language of your choice. Gain proficiency with a tool and a vehicle.",
    "languages": "",
    "equipment": "Five pieces of chalk, a grappling hook, a set of dark traveler’s clothes or a costume, and a pouch containing 10 gp.",
    "talentChoices": [
      "Covert",
      "Scrutinous",
      "Touch of Luck"
    ]
  },
  {
    "id": "homesteader",
    "name": "Homesteader",
    "flavor": "You forged a livelihood in the places between civilization and the unknown hinterlands. The demands of frontier life calloused you, but you understand the wilderness and your place in it.",
    "skills": "Survival and choose one from Athletics, Animal Handling, or Intimidation.",
    "additional": "Gain proficiency with either herbalism tools or navigator’s tools.",
    "languages": "",
    "equipment": "A hunting trap, fishing tackle, a razor-sharp skinning knife, a canvas hammock, a set of heavy traveler’s clothes, and a pouch containing 8 gp worth of gold- crusted quartz.",
    "talentChoices": [
      "Aware",
      "Dungeoneer",
      "Far Traveler"
    ]
  },
  {
    "id": "maker",
    "name": "Maker",
    "flavor": "You pursued a unique, often profitable craft and became an expert. Those with an eye for quality might seek your work out among hundreds of other crafters.",
    "skills": "Investigation and one skill of your choice from the following: History, Performance, or Sleight of Hand.",
    "additional": "Gain proficiency with one tool. Double your PB when you make a check using that tool.",
    "languages": "",
    "equipment": "A tool you are proficient with; a wax seal, ink stamp, or chisel of your personal emblem; a set of traveler’s clothes, and a pouch containing 10 gp worth of gold shavings or silver dust.",
    "talentChoices": [
      "Artillerist",
      "School Specialization",
      "Trade Skills"
    ]
  },
  {
    "id": "outcast",
    "name": "Outcast",
    "flavor": "You spent your life surviving on scraps and taking what you could.",
    "skills": "Choose two from Deception, Insight, Sleight of Hand, or Stealth.",
    "additional": "You gain proficiency with one type of game set and one of the following: charlatan’s tools, herbalism tools, or thieves’ tools.",
    "languages": "",
    "equipment": "A dark cloak and a set of dark, common clothes, a silver coin given to you by a kind stranger, and a pouch containing 10 gp.",
    "talentChoices": [
      "Aware",
      "Opportunist",
      "Quick"
    ]
  },
  {
    "id": "rustic",
    "name": "Rustic",
    "flavor": "You spent most of your life as no one of consequence. Years of hard work gave you an unshakeable resolve, but your past is no mystery and affords you no grand understanding of the world.",
    "skills": "Choose two from Athletics, Acrobatics, Investigation, or Medicine.",
    "additional": "Gain proficiency with vehicles (land) and one of the following: a martial weapon, a musical instrument, a tool, or one type of armor.",
    "languages": "",
    "equipment": "A backpack, a bedroll, a warm blanket woven by a friend or family member, three candles, a set of traveler’s clothes, and a pouch containing 20 sp.",
    "talentChoices": [
      "Comrade",
      "Hand to Hand",
      "Physical Fortitude"
    ]
  },
  {
    "id": "scholar",
    "name": "Scholar",
    "flavor": "You spent years researching a branch of study. Time spent in academic pursuits honed your mind, allowing you to view the world through an intellectual lens afforded to few.",
    "skills": "Choose two from Arcana, History, Nature, or Religion.",
    "additional": "Learn two additional languages of your choice or gain proficiency with a tool or vehicle relevant to your field of study.",
    "languages": "",
    "equipment": "A bottle of ink, a quill, a small knife, a reference book on a highly specific subject, a set of common clothes, and a pouch containing 10 gp.",
    "talentChoices": [
      "Polyglot",
      "Ritualist",
      "School Specialization"
    ]
  },
  {
    "id": "soldier",
    "name": "Soldier",
    "flavor": "You spent a significant amount of time risking your life to defend others. You survived through rigorous training, discipline, and sacrificing comforts that most people take for granted.",
    "skills": "Choose two from Animal Handling, Athletics, Medicine, or Survival.",
    "additional": "Gain proficiency with a tool and a vehicle of your choice.",
    "languages": "",
    "equipment": "A symbol of rank (like a letter, badge, or identification tags), a mess kit, a pack of playing cards or a set of dice, a set of common clothes, and a pouch containing 10 gp.",
    "talentChoices": [
      "Combat Casting",
      "Combat Conditioning",
      "Field Medic"
    ]
  }
]

export function getBackground(id: string | null): BackgroundDef | undefined {
  return id ? BACKGROUNDS.find((b) => b.id === id) : undefined
}
