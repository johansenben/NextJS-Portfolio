export type Prop = string;
export type PropWithAlias<P extends Prop = Prop> = { prop: P; as: string };
export type Table = string;

export type Operator = "=" | ">" | "<" | "LIKE" | "IN" | "AND" | "OR";
export type Condition = [prop: Prop, operator: Operator, value: SQLType | SQLType[]];
export const conditionToString = (condition: Condition) => `${condition[0]} ${condition[1]} ${condition[2]}`;
export type SQLType = string | number | boolean | null;
export type SQLColumnType =
	| "SERIAL"
	| "INT"
	| `DECIMAL(${number},${number})`
	| "BOOLEAN"
	| "TEXT"
	| "TIMESTAMP"
	| `CHAR(${number})`
	| `VARCHAR(${number})`
	| "SMALLINT"
	| "BIGINT"
	| `NUMERIC(${number}|${number})`
	| "FLOAT"
	| "REAL"
	| "DOUBLE PRECISION"
	| "DOUBLE"
	| "DATE"
	| "TIME"
	| "TIMESTAMPZ"
	| "INTERVAL"
	| "UUID"
	//| "ENUM"
	| "JSON"
	| (string & {});

export function cleanSQL(str: string) {
	return str.replace(/\s+/g, " ").trim();
}
