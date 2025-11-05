import clsx from "clsx";
import { useState } from "react";

type Props<Values extends string> = {
	name: string;
	values: readonly Values[];
	setCurrent: (v: Values) => void;
	current?: Values;
	defaultVal: string;
	className?: {
		main?: string;
		current?: string;
	};
};
export default function Select<Values extends string>({
	className,
	name,
	values,
	setCurrent,
	current,
	defaultVal
}: Props<Values>) {
	const x = /*tw*/ "text-";
	const [open, setOpen] = useState(false);
	if (defaultVal in values) setCurrent(defaultVal as Values);
	return (
		<div className={clsx("relative w-64 h-8", open ? "z-10" : "", className?.main)}>
			<div
				className="w-full h-full flex items-center justify-start border-2 border-solid border-current rounded-[.5rem_.5rem_0_0] bg-gray-200"
				onClick={() => setOpen(!open)}
			>
				{current ?? defaultVal}
			</div>
			{open && (
				<div className="absolute top-[100%] w-full h-full">
					{values.map((v, i) => (
						<div
							key={`select-${name}-${i}`}
							className={clsx(
								"w-full h-full flex items-center justify-start border-2 border-solid border-current bg-gray-200 z-10 cursor-pointer",
								v == current ? className?.current : ""
							)}
							onClick={() => {
								setCurrent(v);
								setOpen(false);
							}}
						>
							{v} {v == current && "Current"}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
