type Prop = string;
type PropWithAlias<P extends Prop = Prop> = { prop: P; as: string };
type Table = string;

type Operator = "=" | ">" | "<" | "LIKE" | "IN" | "AND" | "OR";
type Condition = [prop: Prop, operator: Operator, value: SQLType | SQLType[]];
const conditionToString = (condition: Condition) => `${condition[0]} ${condition[1]} ${condition[2]}`;
type SQLType = string | number | boolean | null;

function cleanSQL(str: string) {
	return str.replace(/\s+/g, " ").trim();
}

const joinTypes = ["INNER", "OUTER", "LEFT", "RIGHT"] as const;
const orderTypes = ["ASC", "DESC"] as const;
namespace Select {
	export type JoinType = (typeof joinTypes)[number];
	export type JoinData = {
		joinType: JoinType;
		table: Table;
		condition: Condition;
	};

	export type OrderType = (typeof orderTypes)[number];
	namespace methods {
		export type JOIN = (joinType: JoinType, table: Table, condition: Condition) => overloads.WithJOIN;
		export type WHERE = (prop: Prop, operator: Operator, value: string) => overloads.WithoutWHERE;
		export type GROUP_BY = (...args: Prop[]) => overloads.WithHAVING;
		export type HAVING = (condition: Condition) => overloads.WithoutGROUP_BY;
		export type ORDER_BY = (prop: Prop, orderType: OrderType) => overloads.WithoutGROUP_BY;
		export type LIMIT = (limit: number) => overloads.WithoutLIMIT;
		export type OFFSET = (offset: number) => overloads.WithoutOFFSET;
	}
	export namespace overloads {
		type Base = { toString: () => string };
		export type WithoutOFFSET = {} & Base;
		export type WithoutLIMIT = Merge<{ OFFSET: methods.OFFSET } & WithoutOFFSET>;
		export type WithoutORDER_BY = Merge<{ LIMIT: methods.LIMIT } & WithoutLIMIT>;
		export type WithoutGROUP_BY = Merge<{ ORDER_BY: methods.ORDER_BY } & WithoutORDER_BY>;
		export type WithHAVING = Merge<{ HAVING: methods.HAVING } & WithoutGROUP_BY>;
		export type WithoutWHERE = Merge<{ GROUP_BY: methods.GROUP_BY } & WithoutGROUP_BY>;
		export type WithJOIN = Merge<{ JOIN: methods.JOIN; WHERE: methods.WHERE } & WithoutWHERE>;

		type P1<T> = [withQuery: string | null, table: Table, props: (keyof T | { prop: keyof T; as: string })[]];
		type P2<T> = [...P1<T>, isDistinct: boolean | undefined];
		type P3<T> = [...P2<T>, joins: JoinData[] | undefined];
		type P4<T> = [...P3<T>, where: string | undefined];
		type P5<T> = [...P4<T>, groupBy: Prop[] | undefined];
		type P6<T> = [...P5<T>, having: Condition | undefined];
		type P7<T> = [...P6<T>, orderBy: { prop: Prop; type: OrderType }[]];
		type P8<T> = [...P7<T>, limit: number | undefined];
		type P9<T> = [...P8<T>, offset: number | undefined];

		type Generic = Partial<Record<Prop, SQLType>>;
		export function SELECT<T extends Generic>(...args: P1<T>): WithJOIN;
		export function SELECT<T extends Generic>(...args: P2<T>): WithJOIN;
		export function SELECT<T extends Generic>(...args: P3<T>): WithJOIN;
		export function SELECT<T extends Generic>(...args: P4<T>): WithoutWHERE;
		export function SELECT<T extends Generic>(...args: P5<T>): WithHAVING;
		export function SELECT<T extends Generic>(...args: P6<T>): WithoutGROUP_BY;
		export function SELECT<T extends Generic>(...args: P7<T>): WithoutGROUP_BY;
		export function SELECT<T extends Generic>(...args: P8<T>): WithoutLIMIT;
		export function SELECT<T extends Generic>(...args: P9<T>): WithoutOFFSET;

		export function SELECT<T extends Partial<Record<Prop, SQLType>>, T2 extends Table>(
			withQuery: string | null,
			table: T2,
			props: (keyof T | { prop: keyof T; as: string })[],
			isDistinct: boolean = false,
			joins: Select.JoinData[] = [],
			where?: string | undefined,
			groupBy?: Prop[] | undefined,
			having?: Condition | undefined,
			orderBy: { prop: Prop; type: OrderType }[] = [],
			limit?: number | undefined,
			offset?: number | undefined
		) {
			return {
				toString: () =>
					cleanSQL(`
          ${withQuery ? `WITH ${withQuery}` : ""}
          SELECT ${isDistinct ? "DISTINCT " : ""}${props.map((p) => (typeof p !== "object" ? p : `${String(p.prop)} AS ${p.as}`)).join(", ")} 
          FROM ${table} 
          ${joins.map((j) => j.joinType + " JOIN " + j.table + " ON " + conditionToString(j.condition)).join(" ")}
          ${where ? "WHERE " + where : ""}
          ${groupBy && groupBy[0] ? "GROUP BY " + groupBy.join(", ") + (having ? "HAVING " + having : "") : ""}
          ${orderBy && orderBy[0] ? "ORDER BY " + orderBy.map((o) => o.prop + " " + o.type).join(", ") : ""}
          ${limit ? "LIMIT " + limit : ""}
          ${offset ? "OFFSET " + offset : ""};`),

				...(!where && {
					JOIN: (joinType: JoinType, table: Table, condition: Condition) =>
						SELECT(withQuery, table, props, isDistinct, [...joins, { joinType, table, condition }])
				}),
				...(!where && {
					WHERE: (prop: Prop, operator: Operator, value: string) =>
						SELECT(withQuery, table, props, isDistinct, joins, conditionToString([prop, operator, value]))
				}),
				...(!groupBy && {
					GROUP_BY: (...groupProps: Prop[]) => SELECT(withQuery, table, props, isDistinct, joins, where, groupProps)
				}),
				...(groupBy &&
					!having && {
						HAVING: (condition: Condition) =>
							SELECT(withQuery, table, props, isDistinct, joins, where, groupBy, condition)
					}),
				...(!limit && {
					ORDER_BY: (prop: Prop, orderType: Select.OrderType) =>
						SELECT(withQuery, table, props, isDistinct, joins, where, groupBy ?? [], having, [
							...orderBy,
							{ prop, type: orderType }
						])
				}),
				...(!limit && {
					LIMIT: (limit: number) =>
						SELECT(withQuery, table, props, isDistinct, joins, where, groupBy ?? [], having, orderBy, limit)
				}),
				...(!offset && {
					OFFSET: (offset: number) =>
						SELECT(withQuery, table, props, isDistinct, joins, where, groupBy ?? [], having, orderBy, limit, offset)
				})
			};
		}
	}
}

namespace Insert {
	export function INSERT<T extends Record<Prop, SQLType>>(
		withQuery: string | null,
		table: Table,
		values: { [k in keyof T]: T[k][] },
		returning?: (Prop | PropWithAlias)[] | undefined
	) {
		return {
			toString: () => {
				const vals: SQLType[][] = [];
				let maxLength = Math.min(...Object.values(values).map((v) => v.length));
				Object.values(values).forEach((values, i) => {
					for (const [i2, value] of values.entries()) {
						if (i2 >= maxLength) return;
						if (!vals[i2]) vals[i2] = [];
						vals[i2] = [...vals[i2], value];
					}
				});
				return cleanSQL(`
          ${withQuery ? "WITH" + withQuery : ""}
          INSERT INTO ${table} (${Object.keys(values).join(", ")})
          VALUES ${vals.map((v) => `(${v.join(", ")})`).join(", ")}
          ${returning && returning[0] ? "RETURNING " + returning.map((p) => (typeof p === "string" ? p : `${p.prop} AS ${p.as}`)).join(", ") : ""};`);
			},
			...(!returning && {
				RETURNING: (r: (Prop | PropWithAlias)[]) => INSERT(withQuery, table, values, r)
			})
		};
	}
}

namespace Update {}

namespace Delete {}

namespace CreateTable {}

namespace CreateDatabase {}

type propsType<TType extends Table, T> = (Extract<keyof T, string> extends never
	? never
	:
			| (`${TType}.${Extract<keyof T, string>}` | `${Extract<keyof T, string>}`)
			| { prop: Extract<keyof T, string>; as: string })[];
export const Builder = <TType extends Table>(table: TType, withQuery: string | null = null) => ({
	SELECT: <T extends Record<Prop, SQLType>>(props: propsType<TType, T>, isDistinct: boolean = false) =>
		Select.overloads.SELECT<T>(withQuery, table, props, isDistinct),
	SELECT_ALL: <T extends Record<Prop, SQLType>>(isDistinct: boolean = false) =>
		Select.overloads.SELECT<T>(withQuery, table, ["*"], isDistinct),
	INSERT: <T extends Record<Prop, SQLType>>(values: {
		[K in keyof T]: T[K][];
	}) =>
		Insert.INSERT<T>(withQuery, table, values) as {
			toString: () => string;
			RETURNING: (r: (keyof T | { prop: keyof T; as: string })[]) => {
				toString: () => string;
			};
		}
});

export {};
