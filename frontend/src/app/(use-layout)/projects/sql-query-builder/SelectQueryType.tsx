import { queryTypes, QueryType } from "./util";

function QueryTypeOption({ type, isChecked, onClick }: { type: QueryType; isChecked: boolean; onClick: () => void }) {
	return (
		<div onClick={onClick}>
			{type}: {isChecked ? "checked" : "not checked"}
		</div>
	);
}

export default function SelectQueryType({
	type,
	setType
}: {
	type: QueryType | null;
	setType: SetState<QueryType | null>;
}) {
	return (
		<div className="">
			{queryTypes.map((t) => (
				<QueryTypeOption key={`Query-Type-Option-${t}`} type={t} isChecked={t === type} onClick={() => setType(t)} />
			))}
		</div>
	);
}
