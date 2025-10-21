"use client";
import Section from "./section";

export default function Skills(props: { isOpen: boolean; open: () => void; close: () => void }) {
	return (
		<Section {...props} title={"Skills & Qualities"}>
			<h3>General</h3>
			<ul>
				<li>Hard-Working</li>
				<li>Punctual</li>
			</ul>
			<h3>Programming Languages, Tools & Frameworks</h3>
			<ul>
				<li>HTML</li>
				<li>CSS</li>
				<li>SASS (CSS)</li>
				<li>Tailwind CSS</li>
				<li>Javascript</li>
				<li>Typescript</li>
				<li>React JS</li>
				<li>Next JS</li>
				<li>C/C++</li>
				<li>C#</li>
				<li>Java</li>
				<li>SQL</li>
				<li>Git/Github</li>
				<li>VS Code</li>
				<li>Python</li>
			</ul>
			<h3>I.T.</h3>
			<ul>
				<li>Terminating Ethernet</li>
				<li>Chromebook Repair</li>
			</ul>
			<h3>Other</h3>
			<ul>
				<li>Forklift</li>
				<li>Pea/Corn Combine</li>
			</ul>
		</Section>
	);
}
