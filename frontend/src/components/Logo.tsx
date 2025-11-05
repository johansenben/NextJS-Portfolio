import Image from "next/image";
import customPathNames from "@/public/images/logos/customPathNames.json";

const pathNames = customPathNames as Record<string, string>;

export default function Logo({ name, size, className }: { name: string; size: number; className?: string }) {
	return (
		<Image
			className={className ?? ""}
			src={`images/logos/${(pathNames[name] as string) ?? name}Logo.svg`}
			alt={name}
			width={size}
			height={size}
		/>
	);
}
