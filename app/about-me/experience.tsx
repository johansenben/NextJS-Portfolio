"use client"
import Section from "./section";

export default function Experience(props: {isOpen: Boolean, open: ()=>void, close: ()=>void}) {
    return (
        <Section {...props} title={"Experience"}>
            <h3>CAsual I.T. Assistant - Horizon School Division - Taber, Alberta</h3>
            <h3>I.T. Summer Student - Horizon School Division - Taber, Alberta</h3>
            <h3>Pea/Corn Combine Operator - Bonduelle - Taber, Alberta</h3>
            <h3>General Laborer - Lantic - TAber, Alberta</h3>
        </Section>
    );
}