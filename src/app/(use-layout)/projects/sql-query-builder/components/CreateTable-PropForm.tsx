import clsx from "clsx";
import { Prop, SQLColumnType } from "../util";
import { NumberInput, TextInput, useRadioButton } from "../../../../../components/Input";
import Select from "./Select";
import { JSX, useEffect, useState } from "react";

export type PropData = { name: Prop; type: SQLColumnType; nullable?: boolean };
export const isValidPropData = (prop: Partial<PropData>): prop is PropData => {
	return prop.name && prop.type ? true : false;
};

const types = ["INT", "VARCHAR", "CHAR", "custom"] as const;
type Types = (typeof types)[number];
const typeData: Record<
	Types,
	{
		required: Record<string, "string" | "number">;
		onAllRequired: (r: Record<string, string | undefined>) => SQLColumnType | null;
	}
> = {
	INT: {
		required: {},
		onAllRequired: ({}) => "INT"
	},
	VARCHAR: {
		required: { Size: "number" },
		onAllRequired: ({ Size }: Record<string, string | undefined>) => (Size ? `VARCHAR(${Size})` : null)
	},
	CHAR: {
		required: { Size: "number" },
		onAllRequired: ({ Size }: Record<string, string | undefined>) => (Size ? `CHAR(${Size})` : null)
	},
	custom: {
		required: { Type: "string" },
		onAllRequired: ({ Type }: Record<string, string | undefined>) => Type ?? null
	}
};

function PropType({
	set,
	type,
	setType
}: {
	set: (v: SQLColumnType) => void;
	type: { type: Types | undefined; [key: string]: string | undefined };
	setType: (t: { type: Types | undefined; [key: string]: string | undefined }) => void;
}) {
	useEffect(() => {
		if (!type.type) return;
		const reqsLeft = Object.keys(typeData[type.type].required).filter((req) => !type[req]);
		if (reqsLeft.length == 0) {
			const t = typeData[type.type].onAllRequired(type);
			if (t) set(t);
		}
	}, [type]);

	return (
		<div className="flex gap-4">
			<Select
				name="selectNextPropType"
				values={types}
				setCurrent={(t: Types) => setType({ ...type, type: t })}
				defaultVal="Select a Type..."
				current={type.type}
				className={{
					main: "",
					current: "text-green-800 border-green-500"
				}}
			/>
			{type.type &&
				Object.entries(typeData[type.type].required).map(([Name, t], i) => (
					<div key={`requiredForType-${t}-${i}`}>
						{
							{
								number: (
									<NumberInput
										label={Name}
										defaultValue={parseInt(type[Name] ?? "0")}
										onChange={(v: number) => setType({ ...type, [Name]: v + "" })}
										min={0}
									/>
								),
								string: (
									<TextInput
										label={Name}
										value={type[Name] ?? ""}
										setValue={(v: string) => setType({ ...type, [Name]: v })}
									/>
								)
							}[t]
						}
					</div>
				))}
		</div>
	);
}

type Props = {
	index: number;
	isOpen: boolean;
	data: Partial<PropData>;
	onClick: () => void;
	set: (p: Partial<PropData>) => void;
	PrimaryComponent: ReturnType<typeof useRadioButton>[2];
	deleteProp: () => void;
};
export default function PropForm({ index, isOpen, data, onClick, set, PrimaryComponent, deleteProp }: Props) {
	const [type, setType] = useState<{ type: Types | undefined; [key: string]: string | undefined }>({ type: undefined });
	const isValid = isValidPropData(data);
	return !isOpen ? (
		<div
			className={clsx("w-full h-8 box-border p-2 border-2 border-solid", isValid ? "text-green-500" : "text-red-500")}
			onClick={onClick}
		>
			{data.name ?? "{Name}"} {data.type ?? "{Type}"}
			<button onClick={deleteProp}>Delete</button>
		</div>
	) : (
		<div className={clsx("w-full box-border p-2 border-2 border-solid", isValid ? "text-green-500" : "text-red-500")}>
			<TextInput label="Name" value={data.name} setValue={(name: string) => set({ ...data, name })} />
			<PropType set={(type: SQLColumnType) => set({ ...data, type })} type={type} setType={setType} />
			<PrimaryComponent index={index} className={{ selected: "text-green-500" }}>
				Primary
			</PrimaryComponent>
		</div>
	);
}
