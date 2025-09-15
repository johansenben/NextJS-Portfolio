"use client"

import { useState } from "react";
import Contact from "./contact";
import Education from "./education";
import Experience from "./experience";
import Skills from "./skills";
import styles from "./aboutMe.module.css";

export default function AboutMe() {
    const [currentlyOpen, setCurrentlyOpen] = useState("none");
        
    const close = () => setCurrentlyOpen("none");
    return (
        <div className={styles.mainBlock}>
            <h1 className={styles.h1} >About Me</h1>

            <Contact isOpen={currentlyOpen === "contact"} open={() => setCurrentlyOpen("contact")} close={close} />

            <Skills isOpen={currentlyOpen === "skills"} open={() => setCurrentlyOpen("skills")} close={close} />

            <Education isOpen={currentlyOpen === "education"} open={() => setCurrentlyOpen("education")} close={close} />

            <Experience isOpen={currentlyOpen === "experience"} open={() => setCurrentlyOpen("experience")} close={close} />
        </div>
    );
}