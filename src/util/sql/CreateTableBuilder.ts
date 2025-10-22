import { Prop, SQLColumnType, SQLType, Table } from "./BuilderTypes";

type NewProp = {
	name: Prop;
	type: SQLColumnType;
	isPrimary?: boolean;
	nullable?: boolean;
	isUnique?: boolean;
	default?: SQLType;
	autoIncrement?: boolean;
};

type Return<T extends NewProp | undefined, P extends boolean> = {
	newSERIAL: (name: Prop) => Return<{ name: Prop; type: "SERIAL" }, P>;
	newINT: (name: Prop) => Return<{ name: Prop; type: "INT" }, P>;
	newDECIMAL: (name: Prop) => Return<{ name: Prop; type: `DECIMAL(${number},${number})` }, P>;
	newBOOL: (name: Prop) => Return<{ name: Prop; type: "BOOLEAN" }, P>;
	newTEXT: (name: Prop) => Return<{ name: Prop; type: "TEXT" }, P>;
	newCHAR: (name: Prop, size: number) => Return<{ name: Prop; type: `CHAR(${number})` }, P>;
	newVARCHAR: (name: Prop, size: number) => Return<{ name: Prop; type: `VARCHAR(${number})` }, P>;
	newTIMESTAMP: (name: Prop) => Return<{ name: Prop; type: "TIMESTAMP" }, P>;

	newCustom: (name: Prop, type: SQLColumnType) => Return<{ name: Prop; type: SQLColumnType }, P>;
} & (T extends undefined
	? {}
	: (T extends { isPrimary?: true }
			? {}
			: P extends true
				? {}
				: { PRIMARY: () => Return<T & { isPrimary: true }, true> }) &
			(T extends { nullable?: true } ? {} : { NULLABLE: () => Return<T & { nullable: true }, P> }) &
			(T extends { isUnique?: true } ? {} : { UNIQUE: () => Return<T & { isUnique: true }, P> }) &
			(T extends { default?: SQLType } ? {} : { DEFAULT: (value: SQLType) => Return<T & { default: SQLType }, P> }) &
			(T extends { type: "INT" }
				? T extends { autoIncrement: true }
					? {}
					: { AUTO_INCREMENT: () => Return<T & { autoIncrement: true }, P> }
				: {}));

export function CREATE<T extends NewProp | undefined, P extends boolean = false>(
	table: Table,
	ifNotExists: boolean,
	props: NewProp[] = [],
	currentProp?: T | undefined
): Return<T, P> {
	function nextProp<T extends NewProp>(newProp: T): Return<T, P> {
		if (currentProp) props = [...props, currentProp];
		return CREATE(table, ifNotExists, props, newProp);
	}

	return {
		newSERIAL: (name: string) => nextProp({ name, type: "SERIAL" }),
		newINT: (name: string) => nextProp({ name, type: "INT" }),
		newDECIMAL: (name: string, precision: number, scale: number) =>
			nextProp({ name, type: `DECIMAL(${precision},${scale})` }),
		newBOOL: (name: string) => nextProp({ name, type: "BOOLEAN" }),
		newTEXT: (name: string) => nextProp({ name, type: "TEXT" }),
		newCHAR: (name: string, size: number) => nextProp({ name, type: `CHAR(${size})` }),
		newVARCHAR: (name: string, size: number) => nextProp({ name, type: `VARCHAR(${size})` }),
		newTIMESTAMP: (name: string) => nextProp({ name, type: "TIMESTAMP" }),

		newCustom: (name: string, type: SQLColumnType) => nextProp({ name, type }),

		...(currentProp?.isPrimary !== true && currentProp != undefined
			? {
					PRIMARY: () => CREATE(table, ifNotExists, props, { ...(currentProp ?? {}), isPrimary: true })
				}
			: {}),

		...(currentProp?.nullable !== true && currentProp != undefined
			? {
					NULLABLE: () => CREATE(table, ifNotExists, props, { ...(currentProp ?? {}), nullable: true })
				}
			: {}),

		...(currentProp?.isUnique !== true && currentProp != undefined
			? {
					UNIQUE: () => CREATE(table, ifNotExists, props, { ...(currentProp ?? {}), isUnique: true })
				}
			: {}),

		...(currentProp?.default === undefined && currentProp != undefined
			? {
					DEFAULT: (value: SQLType) => CREATE(table, ifNotExists, props, { ...(currentProp ?? {}), default: value })
				}
			: {}),

		...(currentProp?.type === "INT" && currentProp?.autoIncrement !== true && currentProp != undefined
			? {
					AUTO_INCREMENT: () => CREATE(table, ifNotExists, props, { ...(currentProp ?? {}), autoIncrement: true })
				}
			: {})
	} as Return<T, P>;
}

CREATE("", true, []).newINT("").AUTO_INCREMENT();
