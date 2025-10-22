import { cleanSQL, Condition, conditionToString, Operator, Prop, SQLType, Table } from "./BuilderTypes";

const joinTypes = ["INNER", "OUTER", "LEFT", "RIGHT"] as const;
const orderTypes = ["ASC", "DESC"] as const;

type JoinType = (typeof joinTypes)[number];
type JoinData = {
	joinType: JoinType;
	table: Table;
	condition: Condition;
};
type OrderType = (typeof orderTypes)[number];

type JOIN = (joinType: JoinType, table: Table, condition: Condition) => WithJOIN;
type WHERE = (prop: Prop, operator: Operator, value: string) => WithoutWHERE;
type GROUP_BY = (...args: Prop[]) => WithHAVING;
type HAVING = (condition: Condition) => WithoutGROUP_BY;
type ORDER_BY = (prop: Prop, orderType: OrderType) => WithoutGROUP_BY;
type LIMIT = (limit: number) => WithoutLIMIT;
type OFFSET = (offset: number) => WithoutOFFSET;

type Base = { toString: () => string };
type WithoutOFFSET = {} & Base;
type WithoutLIMIT = Merge<{ OFFSET: OFFSET } & WithoutOFFSET>;
type WithoutORDER_BY = Merge<{ LIMIT: LIMIT } & WithoutLIMIT>;
type WithoutGROUP_BY = Merge<{ ORDER_BY: ORDER_BY } & WithoutORDER_BY>;
type WithHAVING = Merge<{ HAVING: HAVING } & WithoutGROUP_BY>;
type WithoutWHERE = Merge<{ GROUP_BY: GROUP_BY } & WithoutGROUP_BY>;
type WithJOIN = Merge<{ JOIN: JOIN; WHERE: WHERE } & WithoutWHERE>;

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
	joins: JoinData[] = [],
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
				HAVING: (condition: Condition) => SELECT(withQuery, table, props, isDistinct, joins, where, groupBy, condition)
			}),
		...(!limit && {
			ORDER_BY: (prop: Prop, orderType: OrderType) =>
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

//todo - make props a method and toString doesnt exist until props method is used at least once
//available props should include props from join
//or add props method as an additional way of adding props
