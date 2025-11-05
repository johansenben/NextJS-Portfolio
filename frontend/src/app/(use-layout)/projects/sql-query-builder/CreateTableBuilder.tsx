import { useState } from "react";
import { TextInput, useRadioButton } from "../../../../components/Input";
import CurrentQuery from "./CurrentQuery";
import PropForm, { isValidPropData, PropData } from "./components/CreateTable-PropForm";

function Query({ table, props }: { table?: string; props: PropData[] }) {
	return table && props[0] ? (
		<div>
			CREATE TABLE {table} (
			{props.map((prop, i) => (
				<div key={`current-query-prop-${i}`}>
					{prop.name} {prop.type}
				</div>
			))}
			);
		</div>
	) : (
		<></>
	);
}

export default function CreateTableBuilder() {
	const [table, setTable] = useState<string | undefined>(undefined);
	const [props, setProps] = useState<Partial<PropData>[]>([]);

	//const [primary, setPrimary] = useState(-1);
	const [primary, click, PrimaryComponent] = useRadioButton();

	const [openProp, setOpenProp] = useState(-1);

	const addProp = () => {
		setProps([...props, {}]);
	};

	return (
		<div>
			<CurrentQuery>
				<Query table={table} props={props.filter((p) => isValidPropData(p))} />
			</CurrentQuery>
			<TextInput label="Table" setValue={setTable} />
			{props.map((data, i) => (
				<PropForm
					index={i}
					key={`prop-${i}`}
					isOpen={openProp == i}
					data={data}
					onClick={() => setOpenProp(i)}
					set={(p: Partial<PropData>) => {
						props[i] = p;
						setProps([...props]);
					}}
					PrimaryComponent={PrimaryComponent}
					deleteProp={() => {
						setProps(props.filter((_, i2) => i2 != i));
						if (primary == i) click();
						else if (primary > i) click(primary - 1);
					}}
				/>
			))}
			<button onClick={addProp}>New</button>
		</div>
	);
}
