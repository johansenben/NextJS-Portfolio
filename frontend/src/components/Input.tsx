import clsx from "clsx";
import { useState, useEffect, ReactNode, JSX } from "react";
import { useUpdateEffect } from "../app/(use-layout)/projects/sql-query-builder/util";

function DebouncedInput({
	setValue,
	placeholder,
	value
}: {
	setValue: (s: string) => void;
	placeholder?: string;
	value?: string;
}) {
	const [input, setInput] = useState("");

	useEffect(() => {
		if (value) setInput(value);
		const handler = setTimeout(() => {
			setValue(input);
		}, 1000); // 1 second debounce

		// Cleanup if input changes before timeout
		return () => {
			clearTimeout(handler);
		};
	}, [input, value]);

	return <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} />;
}

export function TextInput({
	//todo change???
	label,
	setValue,
	value,
	incorrect,
	disabled
}: {
	label: string;
	setValue: (s: string) => void;
	value?: string;
	incorrect?: boolean;
	disabled?: boolean;
}) {
	return (
		<label>
			{label}: <DebouncedInput value={value} setValue={setValue} />
		</label>
	);
}

export const useCheckbox = (onChange: (checked: boolean) => void = () => {}, defaultChecked = false) => {
	const [checked, setChecked] = useState(defaultChecked);

	useUpdateEffect(() => {
		onChange(checked);
	}, [checked]);

	const comp = ({ className, children }: { className?: { main?: string; checked?: string }; children?: ReactNode }) => (
		<div className={clsx(className?.main, checked && className?.checked)} onClick={() => setChecked((prev) => !prev)}>
			{children}
		</div>
	);

	return [checked, () => setChecked((prev) => !prev), comp] as [
		checked: boolean,
		click: () => void,
		checkbox: typeof comp
	];
};

export function CheckboxInput({
	onChange,
	defaultChecked,
	className,
	children
}: {
	onChange?: (checked: boolean) => void;
	defaultChecked?: boolean;
	className?: { main?: string; checked?: string };
	children?: ReactNode;
}) {
	const [, , Comp] = useCheckbox(onChange, defaultChecked);
	return <Comp className={className}>{children}</Comp>;
}

export const useRadioButton = (onChange: (index: number) => void = () => {}, defaultIndex = -1) => {
	const [checked, setChecked] = useState(defaultIndex);

	useUpdateEffect(() => {
		onChange(checked);
	}, [checked]);

	const comp = ({
		index,
		className,
		children
	}: {
		index: number;
		className?: { main?: string; selected?: string };
		children?: ReactNode;
	}) => (
		<div onClick={() => setChecked(index)} className={clsx(className?.main, index == checked && className?.selected)}>
			{children}
		</div>
	);

	return [checked, (index: number = -1) => setChecked(index), comp] as [
		checked: number,
		click: (index?: number) => void,
		radioBtn: typeof comp
	];
};

export const useNumberInput = (
	label: string,
	onChange: (val: number) => void = () => {},
	defaultValue = 0,
	min = 0,
	max?: number
) => {
	const [value, setValue] = useState(defaultValue);

	useUpdateEffect(() => {
		onChange(value);
	}, [value]);

	const increase = (delta: number) =>
		delta > 0
			? max == undefined || value + delta <= max
				? setValue(value + delta)
				: setValue(max)
			: value + delta >= min
				? setValue(value + delta)
				: setValue(min);

	const comp = ({
		className
	}: {
		className?: { main?: string; label?: string; value?: string; increase?: string; decrease?: string };
	}) => (
		<div className={className?.main ?? "flex gap-2"}>
			<span className={className?.label ?? ""}>{label}</span>
			<div
				className={
					className?.decrease ??
					"border-r-12 border-b-12 border-t-12 border-t-transparent border-b-transparent cursor-pointer"
				}
				onClick={() => increase(-1)}
			></div>
			<div className={className?.value ?? "w-[2ch] text-center"}>{value}</div>
			<div
				className={
					className?.increase ??
					"border-l-12 border-b-12 border-t-12 border-t-transparent border-b-transparent cursor-pointer"
				}
				onClick={() => increase(1)}
			></div>
		</div>
	);

	return [value, increase, (delta: number) => increase(-1 * delta), comp] as [
		value: number,
		increase: (delta: number) => void,
		decrease: (delta: number) => void,
		Input: typeof comp
	];
};

export function NumberInput({
	label,
	onChange,
	defaultValue,
	min,
	max,
	className
}: {
	label: string;
	onChange?: (v: number) => void;
	defaultValue: number;
	min?: number;
	max?: number;
	className?: { main?: string; label?: string; value?: string; increase?: string; decrease?: string };
}) {
	const [, , , Comp] = useNumberInput(label, onChange, defaultValue, min ?? 0, max);
	return <Comp className={className} />;
}
