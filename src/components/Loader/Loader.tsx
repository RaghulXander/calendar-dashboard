import React from "react";
import styles from "./Loader.module.scss";

export interface StateProps {
	className?: string;
	/**
	 * The optional children for the buttons, and content with HTML markup.
	 *
	 * **Text content must be wrapped in `<Typography>` explicitly.**
	 */
	children?: React.ReactNode;

	/**
	 * Sets whether the ellipsis animation should be displayed.
	 */
	loading?: boolean;
}

/**
 * A component for providing a visual state for the end-user to be used with
 * listings and empty applications.
 */
export const State = (props: StateProps) : React.ReactElement => {
	const classNames = [styles["ui-state"]];

	if (props.loading) classNames.push(styles["loading"]);
	if (props.className) classNames.push(props.className);

	const loadingDots = props.loading && (
		<>
			<span>.</span>
			<span>.</span>
			<span>.</span>
		</>
	);

	const content = (
		<div className={styles["content"]}>
			{loadingDots}
			{props.children}
		</div>
	);

	return (
		<div
			role="presentation"
			className={classNames.join(" ")}
		>
			{content}
		</div>
	)
}
