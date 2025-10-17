"use client";

import {
  ProjectCard,
  ProjectComingSoonCard,
  ProjectIdeaCard,
} from "./ProjectCard";
import styles from "./projects.module.css";

export default function Projects() {
  return (
    <div className={styles.mainBlock}>
      <h1 className={styles.h1}>Projects</h1>
      <ul className="grid lg:grid-cols-2 sm:grid-cols-1 ">
        <ProjectCard name="Sudoku" description="Sudoku game with a solver" href="/sudoku" image="/images/projects/sudoku.png" />
        <ProjectComingSoonCard
          name="2 Player Chess"
          description="Chess game that uses sockets to make it possible to play with 2 different devices"
        />
        <ProjectComingSoonCard
          name="Rubik's Cube"
          description="3D Rubik's Cube with controls and animations. I might add a solver in the future"
        />

        <ProjectIdeaCard name="A Star Pathfinding" description="" />
        <ProjectIdeaCard name="Tetris" description="" />
        <ProjectIdeaCard name="Checkers" description="" />
        <ProjectIdeaCard name="Live Chat Room" description="" />
      </ul>
    </div>
  );
}
