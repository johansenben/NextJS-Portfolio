type Stat = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";
const featureTags = {
  Uses: (totalUses: number) => [ `Uses-fraction@${totalUses}/${totalUses}` ],
  Resets: (when?: "short rest" | "long rest" | "button") => when ? [ `Resets-value@${when}` ] : [],
  Damage: (damage: string) => `Damage-value@${damage}`,
  Range: (range: number) => `Range-value@${range}`,
  Other: [
    "PromptOnShortRest",
    "PromptOnLongRest",
    "PromptOnAllRests"
  ]
  //AddStatToInitiative: (stat: Stat) => `AddToInitiative-${stat}`, todo? too much work? too complicated?

}

type SheetData = {
	playerName: string;
	coreInfo: {
		name?: string;
		levels?: {
			class: string;
			levels: number;
		}[];
		race: string;
		alignment: string;
		background: string;
		experience?: number;
	};
	inspiration: boolean;
	stats: {
		STR: number;
		DEX: number;
		CON: number;
		INT: number;
		WIS: number;
		CHA: number;
    proficiencyBonus: number,
		savingThrowProficiencies: string[];
		proficiencies: string[];
		experties: string[];
		AC: number;
		ACwithShield?: number;
		initiative: number;
		speed: {
			walk: number;
			swim?: number;
			climb?: number;
			fly?: number;
		};
		maxHP: number;
		currentHP: number;
		tempHP?: number;
		hitDice: string;
		totalHitDice: number;
		saves?: {
			successes: number;
			failures: number;
		};
	};
	weapons: {
		type: string;
		damage: string;
		range?: number;
		extraInfo?: string;
	}[];
	inventory: {
		money: {
			copper: number;
			silver: number;
			electrum: number;
			gold: number;
			platinum: number;
		};
		ammo: {
			type: string;
			amount: number;
			extraInfo?: string;
		}[];
		others: {
			type: string;
			amount?: number;
			extraInfo: string;
		}[];
	};
	features: {
		name: string;
		description: string;
    //name-value:default
		tags: string
	}[];
	languages: string[];
	otherProficiencies: string[];
	spells: ({
		abillity: string;
		attackBonus: number;
		saveDC: number;
	} & {
		[key in "level1" | "level2" | "level3" | "level4" | "level5" | "level6" | "level7" | "level8" | "level9"]: {
			totalSlots: number;
			slotsUsed: number;
			spells: {
				spell: string;
				damage: string;
				range?: number;
				description?: string;
				prepared: boolean;
			}[];
		};
	})[];
	backstory: {
		personalityTraits: string[];
		ideals: string[];
		bonds: string[];
		flaws: string[];
		age: string;
		height: string;
		weight: string;
		eyes?: string;
		skin?: string;
		hair?: string;
		backstory: string;
		otherAppearanceInfo: string;
		allies: string[];
		organizations: string[];
		featuresAndTraits: string[];
		treasure: string[];
	};
};
