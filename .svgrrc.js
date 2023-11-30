module.exports = {
	dimensions: true,
	expandProps: false,
	typescript: true,
	svgProps: {
		width: "{props.size ?? 16}",
		height: "{props.size ?? 16}",
		"aria-hidden": "{props.ariaHidden ?? true}",
	},
	svgoConfig: {
		plugins: [
			{
			name: 'preset-default',
			params: {
				overrides: {
				// disable plugins
				removeViewBox: false,
				},
			},
			},
		],
	},
	template({ componentName, jsx }, { tpl  }) {
		//const typeScriptTpl = template.smart({ plugins: ["typescript"], preserveComments: true });
		return tpl `
		// THIS IS AUTO GENERATED
		import * as React from 'react';
		import { IconProps } from "../..";

		const ${componentName} = (props: IconProps): JSX.Element => ${jsx};

		export default ${componentName};
	`;
	},
};
