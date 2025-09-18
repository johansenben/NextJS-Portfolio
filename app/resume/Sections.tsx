"use client"
import clsx from "clsx";
import { ReactNode, useState } from "react";

function LeftH2({children}: {children: ReactNode}) {
  return <h2 className="font-bold text-2xl">{children}</h2>;
}
function LeftDataPair({label, value}: {label: string, value: string}) {
  return <><h3 className="font-medium text-base">{label}: </h3><span className="font-light print:text-xs">{value}</span></>;
}
export function Contact({phone, email}: {phone: string, email: string}) {
  return (
    <div className="mt-8">
      <LeftH2>Contact</LeftH2>
      <LeftDataPair label="Cell Phone" value={phone} />
      <LeftDataPair label="Email" value={email} />
    </div>
  );
}
export function Links({portfolio, linkedin}: {portfolio: string, linkedin: string}) {
  return (
    <div className="mt-8">
      <LeftH2>Links</LeftH2>
      <LeftDataPair label="Portfolio" value={portfolio} />
      <LeftDataPair label="LinkedIn" value={linkedin} />
    </div>
  );
}

function RightH2({children}: {children: ReactNode}) {
  return <h2 className="font-bold text-3xl">{children}</h2>;
}

type ExpProps = {employer: string, title: string, starts: string[], ends: string[], description: string, location: string};
function ExperienceCard({index, expanded, employer, title, starts, ends, description, location}: ExpProps & {index: number, expanded: boolean}) {
  return (
    <div className={clsx("border-2 grid grid-cols-4 p-2 my-2", index >= 2 && !expanded ? "hidden print:block": '')}>
      <h3 className="font-medium text-2xl col-start-1 col-span-3 print:col-span-4">{title}</h3>
      <h4 className="font-normal text-xl col-start-1 col-span-3 print:col-span-4">{employer} - {location}</h4>
      <div className="col-start-4 row-start-1 row-span-2 print:row-start-3 print:col-start-1">
        {starts.map((start, i) => ends[i] ? <h5 className="font-light text-sm text-right print:text-xs print:text-left" key={`exp-${title}-${start}`}>{start} - {ends[i]}</h5> : '')}
      </div>
      <p className="col-span-4 text-sm" >{description}</p>
    </div>
  );
}
export function Experience({experience}: {experience: ExpProps[]}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <RightH2>Experience</RightH2>
      {experience.map((e,i) =>  <ExperienceCard {...e} index={i} expanded={expanded} key={`experience-card-${i}`} />)}
      <button className={clsx("print:hidden", experience.length <= 2 && "hidden")} onClick={()=>setExpanded(!expanded)}>{expanded ? "Show Less" : "Show More"}</button>
    </div>
  );
}

type EduProps = {school: string, location: string, degree: string, start: string, end: string, details: string[]};
function EducationCard({index, expanded, school, location, degree, start, end, details}: EduProps & {index: number, expanded: boolean}) {
  return (
    <div className={clsx("border-2 grid grid-cols-4 p-2 my-2", index >= 2 && !expanded ? "hidden print:block": '')}>
      <h3 className="font-medium text-2xl col-start-1 col-span-3 print:col-span-4">{degree}</h3>
      <h4 className="font-normal text-xl col-start-1 col-span-3 print:col-span-4">{school} - {location}</h4>
      <div className="col-start-4 row-start-1 row-span-2 print:row-start-3 print:col-start-1">
      <h5 className="font-light text-sm text-right print:text-xs print:text-left">{start} - {end}</h5>
      </div>
      <p className="col-span-4 text-sm" >{details}</p>
    </div>
  );
}
export function Education({education}: {education: EduProps[]}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <RightH2>Education</RightH2>
      {education.map((e,i) =>  <EducationCard {...e} index={i} expanded={expanded} key={`experience-card-${i}`} />)}
      <button className={clsx("print:hidden", education.length <= 2 && "hidden")} onClick={()=>setExpanded(!expanded)}>{expanded ? "Show Less" : "Show More"}</button>
    </div>
  );
}

export function Skills({skills}: {skills:{}[]}) {
  return (
    <div>
      <RightH2>Skills</RightH2>
    </div>
  );
}