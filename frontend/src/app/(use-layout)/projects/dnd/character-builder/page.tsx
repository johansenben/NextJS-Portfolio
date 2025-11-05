"use client";

import { useState } from "react";

export default function CharacterBuilder() {
	const [sheet, setSheet] = useState<Partial<SheetData> | null>(null);

	const newSheet = () => {
		setSheet({});
	};

	const uploadSheet = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const parsed = JSON.parse(e.target?.result as string);
				setSheet(parsed);
			} catch (error) {
				alert("Invalid JSON file.");
			}
		};
		reader.readAsText(file);
	};

	const saveSheet = () => {
		if (!sheet) {
			alert("No JSON data to save.");
			return;
		}

		const jsonString = JSON.stringify(sheet, null, 2);
		const blob = new Blob([jsonString], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = "data.json";
		link.click();

		URL.revokeObjectURL(url);
	};

	return sheet ? (
		<></>
	) : (
		<div>
			<button onClick={newSheet}>New</button>
			<input type="file" accept=".json" onChange={uploadSheet} />
		</div>
	);
}
