import { cleanSQL, Prop, PropWithAlias, SQLType, Table } from "./BuilderTypes";

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