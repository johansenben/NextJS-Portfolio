"use client"
import { ReactNode } from 'react';
import styles from "./aboutMe.module.css";
import clsx from 'clsx';

export default function Section({children, title, isOpen, open, close}: {children: ReactNode, title: string, isOpen: Boolean, open: ()=>void, close: ()=>void}) {
    return (
        <div className={styles.section}>
            <h2 onClick={e => isOpen ? close() : open()} className={clsx(styles.h2, isOpen ? styles.openSectionHeader : styles.closedSectionHeader)} >{title}</h2>
            <div className={isOpen ? styles.openSection : styles.closedSection}>
                {children}
            </div>
        </div>
    );
}