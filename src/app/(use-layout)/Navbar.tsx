"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/about-me", label: "About Me" },
	{ href: "/projects", label: "Projects" }
];

export default function Navbar() {
	const pathname = usePathname();
	return (
		<nav className={styles.nav}>
			<ul>
				{navLinks.map((link) => (
					<li key={link.label}>
						<Link href={link.href} className={clsx(pathname === link.href ? styles.currentPage : "")}>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
