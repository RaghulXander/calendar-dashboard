import React, { useEffect, useState } from "react";
import styles from "./DarkModeToggle.module.scss";

/**
 * A component for toggling between the default light and dark themes.
 * Store your preference
 * Currently for local dev only.
 */
export const DarkModeToggle: React.FC = () => {
	const [inDarkMode, setInDarkMode] = useState(localStorage.getItem("dark-mode") === "true" || false);

	useEffect(() => {
		const rootElement = document.documentElement;

		if (inDarkMode) {
			rootElement.className += " dark";
			localStorage.setItem("dark-mode", "true");
		} else {
			rootElement.className = rootElement.className.replace(" dark", "");
			localStorage.setItem("dark-mode", "false");
		}
	}, [inDarkMode]);

	return (
		<button className={styles["dark-mode-toggle"]} onClick={() => setInDarkMode(!inDarkMode)}>
			<span>Toggle Dark Mode</span>
		</button>
	);
};
