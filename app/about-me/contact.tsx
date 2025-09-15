"use client"
import Section from "./section";

export default function Contact(props: {isOpen: Boolean, open: ()=>void, close: ()=>void}) {
    return (
        <Section {...props} title={"Contact Me"}>
            <h3>Phone: <span>(403) 892 - 2291</span></h3>
            <h3>Email: <span>johansenben12@gmail.com</span></h3>
        </Section>
    );
}