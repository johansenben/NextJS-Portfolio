// Base: Single snake_case word (letters, digits, and underscores)
type SnakeCase =
  | `${Lowercase<string>}_${Lowercase<string>}`
  | Lowercase<string>;

// Full snake_case or snake_case.snake_case (with only one dot)
type SnakeCaseWithOptionalDot = SnakeCase | `${SnakeCase}.${SnakeCase}`;

type Prop = SnakeCaseWithOptionalDot;
type PropWithAlias = { prop: SnakeCaseWithOptionalDot; as: string };
type Table = string;

type Operator = "=" | ">" | "<" | "LIKE" | "IN" | "AND" | "OR";
type Condition = [prop: Prop, operator: Operator, value: SQLType | SQLType[]];
const conditionToString = (condition: Condition) =>
  `${condition[0]} ${condition[1]} ${condition[2]}`;
type SQLType = string | number | boolean | null;

type JOIN = (
  joinType: JoinType,
  table: Table,
  condition: Condition,
) => WithJOIN;
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

function SELECT(
  withQuery: string | null,
  table: Table,
  props: (Prop | PropWithAlias)[],
): WithJOIN;
function SELECT(
  withQuery: string | null,
  table: Table,
  props: (Prop | PropWithAlias)[],
  isDistinct: boolean,
): WithJOIN;
function SELECT(
  withQuery: string | null,
  table: Table,
  props: (Prop | PropWithAlias)[],
  isDistinct: boolean,
  joins: JoinData[],
): WithJOIN;

function SELECT(
  withQuery: string | null,
  table: Table,
  props: (Prop | PropWithAlias)[],
  isDistinct: boolean,
  joins: JoinData[],
  where: string,
): WithoutWHERE;

function SELECT(
  withQuery: string | null,
  table: Table,
  props: (Prop | PropWithAlias)[],
  isDistinct: boolean,
  joins: JoinData[],
  where: string | undefined,
  groupBy: Prop[],
): WithHAVING;

function SELECT(
  withQuery: string | null,
  table: Table,
  props: (Prop | PropWithAlias)[],
  isDistinct: boolean,
  joins: JoinData[],
  where: string | undefined,
  groupBy: Prop[],
  having: Condition,
): WithoutGROUP_BY;

function SELECT(
  withQuery: string | null,
  table: Table,
  props: (Prop | PropWithAlias)[],
  isDistinct: boolean,
  joins: JoinData[],
  where: string | undefined,
  groupBy: Prop[],
  having: Condition | undefined,
  orderBy: { prop: Prop; orderType: OrderType }[],
): WithoutGROUP_BY;

function SELECT(
  withQuery: string | null,
  table: Table,
  props: (Prop | PropWithAlias)[],
  isDistinct: boolean,
  joins: JoinData[],
  where: string | undefined,
  groupBy: Prop[],
  having: Condition | undefined,
  orderBy: { prop: Prop; orderType: OrderType }[],
  limit: number,
): WithoutLIMIT;

function SELECT(
  withQuery: string | null,
  table: Table,
  props: (Prop | PropWithAlias)[],
  isDistinct: boolean,
  joins: JoinData[],
  where: string | undefined,
  groupBy: Prop[],
  having: Condition | undefined,
  orderBy: { prop: Prop; orderType: OrderType }[],
  limit: number | undefined,
  offset: number | undefined,
): WithoutOFFSET;

function SELECT(
  withQuery: string | null,
  table: Table,
  props: (Prop | PropWithAlias)[],
  isDistinct: boolean = false,
  joins: JoinData[] = [],
  where?: string | undefined,
  groupBy?: Prop[] | undefined,
  having?: Condition | undefined,
  orderBy: { prop: Prop; orderType: OrderType }[] = [],
  limit?: number | undefined,
  offset?: number | undefined,
) {
  const builder = {
    toString: () =>
      cleanSQL(`
      ${withQuery ? `WITH ${withQuery}` : ""}
      SELECT ${isDistinct ? "DISTINCT " : ""}${props.map((p) => (typeof p === "string" ? p : `${p.prop} AS ${p.as}`)).join(", ")} 
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
            SELECT(withQuery, table, props, isDistinct, [
              ...joins,
              { joinType, table, condition },
            ]),
        }
      : {}),
    ...(!where
      ? {
          WHERE: (prop: Prop, operator: Operator, value: string) =>
            SELECT(
              withQuery,
              table,
              props,
              isDistinct,
              joins,
              conditionToString([prop, operator, value]),
            ),
        }
      : {}),
    ...(!groupBy
      ? {
          GROUP_BY: (...groupProps: Prop[]) =>
            SELECT(
              withQuery,
              table,
              props,
              isDistinct,
              joins,
              where,
              groupProps,
            ),
        }
      : {}),
    ...(groupBy && !having
      ? {
          HAVING: (condition: Condition) =>
            SELECT(
              withQuery,
              table,
              props,
              isDistinct,
              joins,
              where,
              groupBy,
              condition,
            ),
        }
      : {}),
    ...(!limit
      ? {
          ORDER_BY: (prop: Prop, orderType: OrderType) =>
            SELECT(
              withQuery,
              table,
              props,
              isDistinct,
              joins,
              where,
              groupBy ?? [],
              having,
              [...orderBy, { prop, orderType }],
            ),
        }
      : {}),
    ...(!limit
      ? {
          LIMIT: (limit: number) =>
            SELECT(
              withQuery,
              table,
              props,
              isDistinct,
              joins,
              where,
              groupBy ?? [],
              having,
              orderBy,
              limit,
            ),
        }
      : {}),
    ...(!offset
      ? {
          OFFSET: (offset: number) =>
            SELECT(
              withQuery,
              table,
              props,
              isDistinct,
              joins,
              where,
              groupBy ?? [],
              having,
              orderBy,
              limit,
              offset,
            ),
        }
      : {}),
  };

  return builder;
}

export const Builder = {
  SELECT,
  SELECT_ALL: (
    withQuery: string | null,
    table: Table,
    isDistinct: boolean = false,
    joins: JoinData[] = [],
    where?: string | undefined,
    groupBy?: Prop[],
    having?: Condition | undefined,
    orderBy: { prop: Prop; orderType: OrderType }[] = [],
    limit?: number | undefined,
    offset?: number | undefined,
  ) =>
    SELECT(
      withQuery,
      table,
      ["*"],
      isDistinct,
      joins,
      where,
      groupBy ?? [],
      having,
      orderBy,
      limit,
      offset,
    ),
};

Builder.SELECT(null, "a", ["123"])
  .JOIN("INNER", "", ["", "=", ""])
  .WHERE("a", "=", "")
  .ORDER_BY("", "ASC")
  .LIMIT(5);
Builder.SELECT(null, "a", ["a"]);
