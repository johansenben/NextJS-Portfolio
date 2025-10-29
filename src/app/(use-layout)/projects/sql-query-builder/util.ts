import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export const queryTypes = ["CREATE_TABLE", "SELECT", "INSERT", "UPDATE", "DELETE"] as const;
export type QueryType = (typeof queryTypes)[number];
export type Prop = string;
export type PropWithTableName = string;
export type PropWithAlias = PropWithTableName | { name: Prop; as: Prop };
export type SQLColumnType =
	| "SERIAL"
	| "INT"
	| `DECIMAL(${number},${number})`
	| "BOOLEAN"
	| "TEXT"
	| "TIMESTAMP"
	| `CHAR(${string})`
	| `VARCHAR(${string})`
	| `ENUM(${string})`
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
	| "JSON"
	| (string & {});

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		// Run the provided effect only after mount
		return effect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
}
