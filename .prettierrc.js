module.exports = {
	// Majority of developers at CDSM prefer the use of tabs.
	useTabs: true,

	// Default of 80 characters was considered to short
	// when viewing some of our JSX code in particular.
	printWidth: 120,

	// Keeping as "auto" as inconsistent line endings aren't an issue worth addressing for now,
	// and "lf" will often flag errors on the build server when running `prettier --check .`
	endOfLine: "auto",
};
