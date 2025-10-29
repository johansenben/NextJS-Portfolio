"use client";

import { useState } from "react";
import { QueryType, queryTypes } from "./util";
import SelectQueryType from "./SelectQueryType";
import CreateTableBuilder from "./CreateTableBuilder";
import Select from "./components/Select";

export default function SqlQueryBuilder() {
	const [queryType, setQueryType] = useState<QueryType | undefined>(undefined);
	return (
		<div>
			<Select
				name="select-query-type"
				values={queryTypes}
				current={queryType}
				setCurrent={setQueryType}
				defaultVal="Select a Query Type..."
				className={{
					main: "",
					current: "text-green-800 border-4 border-green-500"
				}}
			/>
			{
				{
					CREATE_TABLE: <CreateTableBuilder />,
					SELECT: <div></div>,
					INSERT: <div></div>,
					UPDATE: <div></div>,
					DELETE: <div></div>,
					"": <></>
				}[queryType ?? ""]
			}
		</div>
	);
}
