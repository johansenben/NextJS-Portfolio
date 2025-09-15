"use client"
import Section from "./section";

export default function Education(props: {isOpen: Boolean, open: ()=>void, close: ()=>void}) {
    return (
        <Section {...props} title={"Education"} >
            <h3>BYU Pathways Program - Online - Jan. 2024 - Now</h3>
            <h3>High-School Diploma - W.R.Myers High School - Taber, Alberta -- Graduated 2020</h3>
        </Section>
    );
}