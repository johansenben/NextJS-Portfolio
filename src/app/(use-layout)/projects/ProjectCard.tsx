"use client";

import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { LightBulbIcon } from "@heroicons/react/16/solid";
import Image from "next/image";

function ProjectCardTemplate({ children, className }: { children: ReactNode; className?: string }) {
	return <li className={clsx("border-4 border-solid m-2 p-4 relative", className ?? "")}>{children}</li>;
}
function Status({
	label,
	Icon,
	className
}: {
	label: string;
	Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	className?: string;
}) {
	return (
		<div className={clsx("flex flex-col items-center m-4 text-sm w-24", className ?? "")}>
			<Icon className="w-8" />
			<span>{label}</span>
		</div>
	);
}
function ProjectCardH2({ children }: { children: ReactNode }) {
	return <h2 className="text-lg font-bold col-span-2">{children}</h2>;
}
export function ProjectCard({
	name,
	description,
	href,
	image
}: {
	name: string;
	description: string;
	href: string;
	image: string;
}) {
	return (
		<ProjectCardTemplate className="text-green-400">
			<Link className="text-black grid grid-cols-4" href={"projects" + href}>
				<ProjectCardH2>{name}</ProjectCardH2>
				<Image src={image} alt={name} width="200" height="200" className="col-span-2 lg:row-span-2" />
				<p className="col-span-2 lg:col-[3/5] lg:row-[3/5]">{description}</p>
				<Status label="Complete" Icon={CheckCircleIcon} className="text-green-500 col-[3/-1] row-[1/3] ml-auto" />
			</Link>
		</ProjectCardTemplate>
	);
}

export function ProjectComingSoonCard({ name, description }: { name: string; description: string }) {
	return (
		<ProjectCardTemplate className="text-yellow-300 grid grid-cols-4">
			<div className="text-black col-span-3">
				<ProjectCardH2>{name}</ProjectCardH2>
				<p>{description}</p>
			</div>
			<Status label="Coming Soon" Icon={ExclamationTriangleIcon} className="absolute top-0 right-0 text-yellow-500" />
		</ProjectCardTemplate>
	);
}

export function ProjectIdeaCard({ name, description }: { name: string; description: string }) {
	return (
		<ProjectCardTemplate className="text-blue-500 grid grid-cols-4">
			<div className="text-black mb-4 col-span-3">
				<ProjectCardH2>{name}</ProjectCardH2>
				<p>{description}</p>
			</div>
			<Status label="Idea" Icon={LightBulbIcon} className="absolute top-0 right-0 text-orange-400" />
		</ProjectCardTemplate>
	);
}
