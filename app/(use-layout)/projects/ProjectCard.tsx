"use client";

export function ProjectCard({ name }: { name: string }) {
  return (
    <li>
      <h2>{name}</h2>
    </li>
  );
}

export function ProjectComingSoonCard({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <li>
      <h2>{name}</h2>
      <p>Comming Soon</p>
      <p>{description}</p>
    </li>
  );
}

export function ProjectIdeaCard({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <li>
      <h2>{name}</h2>
      <p>Project Idea</p>
      <p>{description}</p>
    </li>
  );
}
