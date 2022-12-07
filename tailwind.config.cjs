/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'black-move': '#769656',
				'white-move': '#eeeed2'
			},
			strokeWidth: {
				3: 3,
				7: 7
			}
		}
	},
	plugins: []
};
