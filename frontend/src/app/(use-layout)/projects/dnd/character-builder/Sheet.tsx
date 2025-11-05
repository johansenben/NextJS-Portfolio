function Heading({
	name,
	levels,
	background,
	playerName,
	race,
	alignment,
	experience
}: {
	name?: string | undefined;
	levels?: { class: string; levels: number }[] | undefined;
	background?: string | undefined;
	playerName?: string | undefined;
	race?: string | undefined;
	alignment?: string | undefined;
	experience?: number | undefined;
}) {
  return (
    <></>
  );
}

function Stat() {}
function Stats({ STR, DEX, CON, INT, WIS, CHA }: { STR?: number | undefined, DEX?: number | undefined, CON?: number | undefined, INT?: number | undefined, WIS?: number | undefined, CHA?: number | undefined }) {
  return (
    <></>
  );
}
function Inspiration({ inspiration }: { inspiration: boolean }) {
  return (
    <></>
  );
}
function ProficiencyBonus({ level }: { level: number }) {
  return (
    <></>
  );
}
function SavingThrows({ savingThrows }: { savingThrows: string[] }) {
  return (
    <></>
  );
}
function Proficiencies() {}
function AC() {}
function Initiative() {}
function Speed() {}
function Health() {}

export default function Sheet({
	sheet,
	setSheet
}: {
	sheet: Partial<SheetData>;
	setSheet: (s: Partial<SheetData>) => void;
}) {
	return <div>
    <Heading {...sheet.coreInfo} playerName={sheet.playerName} />
    <Stats {...sheet.stats} />
    <Inspiration inspiration={sheet.inspiration ?? false} />
    <ProficiencyBonus level={sheet.coreInfo?.levels?.reduce((prev, curr) => prev + (curr?.levels ?? 0), 0) ?? 0} />
    <SavingThrows savingThrows={sheet.stats?.savingThrowProficiencies ?? []} />
  </div>;
}
