/*
            |  Ben Johansen           - Web Developer & IT Technician
  picture   |
            |   Experience
            |     ............
  contact   |     ............
    ...     |     ............
    ...     |
    ...     |   Education
            |     ............
  links     |     ............
   ...      |     ............
   ...      |
            |   Skills
            |     ...   ...   ...
            |     ...   ...   ...

*/
"use client";

import data from "@/data/resume-data.json";
import { Contact, Links, Experience, Education, Skills } from "./Sections";

export default function Resume() {
	return (
		<main className="grid grid-cols-4">
			{/* header */}
			<section className="col-start-2 col-end-5">
				<h1 className="font-bold text-4xl ml-8">Ben Johansen</h1>
				<h2 className="font-medium text-3xl ml-16">Web Developer & I.T. Technician</h2>
				{/* <button>Print - live only</button> */}
			</section>
			{/* left side */}
			<section className="col-start-1 col-end-2 row-start-1 row-end-3 h-full bg-gray-300 p-4">
				{/* <Image /> */}
				<Contact {...data.contact} />
				<Links {...data.links} />
			</section>
			{/* right side */}
			<section className="col-start-2 col-end-5 p-4">
				<div>
					<Experience experience={data.experience} />

					<Education education={data.education} />

					<Skills skills={data.skills} />
				</div>
			</section>
		</main>
	);
}
