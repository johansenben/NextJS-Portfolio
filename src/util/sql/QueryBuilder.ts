import { cleanSQL, Prop, PropWithAlias, SQLType, Table } from "./BuilderTypes";
import { INSERT } from "./InsertBuilder";
import { SELECT } from "./SelectBuilder";

// namespace Update {}

// namespace Delete {}

// namespace CreateDatabase {}

type propsType<TType extends Table, T> = (Extract<keyof T, string> extends never
	? never
	:
			| (`${TType}.${Extract<keyof T, string>}` | `${Extract<keyof T, string>}`)
			| { prop: Extract<keyof T, string>; as: string })[];
export const Builder = <TType extends Table>(table: TType, withQuery: string | null = null) => ({
	SELECT: <T extends Record<Prop, SQLType>>(props: propsType<TType, T>, isDistinct: boolean = false) =>
		SELECT<T>(withQuery, table, props, isDistinct),
	SELECT_ALL: <T extends Record<Prop, SQLType>>(isDistinct: boolean = false) =>
		SELECT<T>(withQuery, table, ["*"], isDistinct),
	INSERT: <T extends Record<Prop, SQLType>>(values: {
		[K in keyof T]: T[K][];
	}) =>
		INSERT<T>(withQuery, table, values) as {
			toString: () => string;
			RETURNING: (r: (keyof T | { prop: keyof T; as: string })[]) => {
				toString: () => string;
			};
		}
});

export {};