// Base: Single snake_case word (letters, digits, and underscores)
type SnakeCase = `${Lowercase<string>}_${Lowercase<string>}` | Lowercase<string>;

// Full snake_case or snake_case.snake_case (with only one dot)
type SnakeCaseWithOptionalDot = SnakeCase | `${SnakeCase}.${SnakeCase}`;

type Prop = string;
type PropWithAlias<P extends SnakeCaseWithOptionalDot = SnakeCaseWithOptionalDot> = { prop: P; as: string };
type Table = string;

type Operator = "=" | ">" | "<" | "LIKE" | "IN" | "AND" | "OR";
type Condition = [prop: Prop, operator: Operator, value: SQLType | SQLType[]];
const conditionToString = (condition: Condition) => `${condition[0]} ${condition[1]} ${condition[2]}`;
type SQLType = string | number | boolean | null;

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

const joinTypes = ["INNER", "OUTER", "LEFT", "RIGHT"] as const;
type JoinType = (typeof joinTypes)[number];
type JoinData = { joinType: JoinType; table: Table; condition: Condition };

const orderTypes = ["ASC", "DESC"] as const;
type OrderType = (typeof orderTypes)[number];

function cleanSQL(str: string) {
	return str.replace(/\s+/g, " ").trim();
}

function SELECT<T extends Partial<Record<Prop, SQLType>>>(
	withQuery: string | null,
	table: Table,
	props: (keyof T | { prop: keyof T; as: string })[]
): WithJOIN;
function SELECT<T extends Partial<Record<Prop, SQLType>>>(
	withQuery: string | null,
	table: Table,
	props: (keyof T | { prop: keyof T; as: string })[],
	isDistinct: boolean
): WithJOIN;
function SELECT<T extends Partial<Record<Prop, SQLType>>>(
	withQuery: string | null,
	table: Table,
	props: (keyof T | { prop: keyof T; as: string })[],
	isDistinct: boolean,
	joins: JoinData[]
): WithJOIN;

function SELECT<T extends Partial<Record<Prop, SQLType>>>(
	withQuery: string | null,
	table: Table,
	props: (keyof T | { prop: keyof T; as: string })[],
	isDistinct: boolean,
	joins: JoinData[],
	where: string
): WithoutWHERE;

function SELECT<T extends Partial<Record<Prop, SQLType>>>(
	withQuery: string | null,
	table: Table,
	props: (keyof T | { prop: keyof T; as: string })[],
	isDistinct: boolean,
	joins: JoinData[],
	where: string | undefined,
	groupBy: Prop[]
): WithHAVING;

function SELECT<T extends Partial<Record<Prop, SQLType>>>(
	withQuery: string | null,
	table: Table,
	props: (keyof T | { prop: keyof T; as: string })[],
	isDistinct: boolean,
	joins: JoinData[],
	where: string | undefined,
	groupBy: Prop[],
	having: Condition
): WithoutGROUP_BY;

function SELECT<T extends Partial<Record<Prop, SQLType>>>(
	withQuery: string | null,
	table: Table,
	props: (keyof T | { prop: keyof T; as: string })[],
	isDistinct: boolean,
	joins: JoinData[],
	where: string | undefined,
	groupBy: Prop[],
	having: Condition | undefined,
	orderBy: { prop: Prop; orderType: OrderType }[]
): WithoutGROUP_BY;

function SELECT<T extends Partial<Record<Prop, SQLType>>>(
	withQuery: string | null,
	table: Table,
	props: (keyof T | { prop: keyof T; as: string })[],
	isDistinct: boolean,
	joins: JoinData[],
	where: string | undefined,
	groupBy: Prop[],
	having: Condition | undefined,
	orderBy: { prop: Prop; orderType: OrderType }[],
	limit: number
): WithoutLIMIT;

function SELECT<T extends Partial<Record<Prop, SQLType>>>(
	withQuery: string | null,
	table: Table,
	props: (keyof T | { prop: keyof T; as: string })[],
	isDistinct: boolean,
	joins: JoinData[],
	where: string | undefined,
	groupBy: Prop[],
	having: Condition | undefined,
	orderBy: { prop: Prop; orderType: OrderType }[],
	limit: number | undefined,
	offset: number | undefined
): WithoutOFFSET;

function SELECT<T extends Partial<Record<Prop, SQLType>>, T2 extends Table>(
	withQuery: string | null,
	table: T2,
	props: (keyof T | { prop: keyof T; as: string })[],
	isDistinct: boolean = false,
	joins: JoinData[] = [],
	where?: string | undefined,
	groupBy?: Prop[] | undefined,
	having?: Condition | undefined,
	orderBy: { prop: Prop; orderType: OrderType }[] = [],
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
      ${orderBy && orderBy[0] ? "ORDER BY " + orderBy.map((o) => o.prop + " " + o.orderType).join(", ") : ""}
      ${limit ? "LIMIT " + limit : ""}
      ${offset ? "OFFSET " + offset : ""};`),

		...(!where
			? {
					JOIN: (joinType: JoinType, table: Table, condition: Condition) =>
						SELECT(withQuery, table, props, isDistinct, [...joins, { joinType, table, condition }])
				}
			: {}),
		...(!where
			? {
					WHERE: (prop: Prop, operator: Operator, value: string) =>
						SELECT(withQuery, table, props, isDistinct, joins, conditionToString([prop, operator, value]))
				}
			: {}),
		...(!groupBy
			? {
					GROUP_BY: (...groupProps: Prop[]) => SELECT(withQuery, table, props, isDistinct, joins, where, groupProps)
				}
			: {}),
		...(groupBy && !having
			? {
					HAVING: (condition: Condition) =>
						SELECT(withQuery, table, props, isDistinct, joins, where, groupBy, condition)
				}
			: {}),
		...(!limit
			? {
					ORDER_BY: (prop: Prop, orderType: OrderType) =>
						SELECT(withQuery, table, props, isDistinct, joins, where, groupBy ?? [], having, [
							...orderBy,
							{ prop, orderType }
						])
				}
			: {}),
		...(!limit
			? {
					LIMIT: (limit: number) =>
						SELECT(withQuery, table, props, isDistinct, joins, where, groupBy ?? [], having, orderBy, limit)
				}
			: {}),
		...(!offset
			? {
					OFFSET: (offset: number) =>
						SELECT(withQuery, table, props, isDistinct, joins, where, groupBy ?? [], having, orderBy, limit, offset)
				}
			: {})
	};
}

type TableExample = {
	x: number;
	y: string;
};

function INSERT<T extends Record<Prop, SQLType>>(
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

export const Builder = <TType extends Table>(table: TType, withQuery: string | null = null) => ({
	SELECT: <T extends Record<Prop, SQLType>>(
		props: (Extract<keyof T, string> extends never
			? never
			:
					| (`${TType}.${Extract<keyof T, string>}` | `${Extract<keyof T, string>}`)
					| { prop: Extract<keyof T, string>; as: string })[],
		isDistinct: boolean = false
	) => SELECT<T>(withQuery, table, props, isDistinct),
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

Builder("x")
	.INSERT<TableExample>({ x: [1], y: [""] })
	.RETURNING(["y"]);
Builder("table_example").SELECT<TableExample>(["table_example.x"]);
