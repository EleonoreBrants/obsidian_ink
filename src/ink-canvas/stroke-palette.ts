///////////////////////////
///////////////////////////

export interface InkStrokeColourOption {
	name: string;
	/** Stored in `InkStrokeStyle.color`. Lowercase `#rrggbb`, or `currentColor` for theme text. */
	value: string;
}

/**
 * Light-theme hex values. Dark-theme equivalents live in `ink-svg-preview-theme.scss`
 * (`$ink-stroke-dark-colours`) — keep the two in sync.
 */
export const INK_STROKE_COLOURS: InkStrokeColourOption[] = [
	{ name: 'Default', value: 'currentColor' },
	{ name: 'Gray', value: '#9fa8b2' },
	{ name: 'Light violet', value: '#e085f4' },
	{ name: 'Violet', value: '#ae3ec9' },
	{ name: 'Blue', value: '#4465e9' },
	{ name: 'Light blue', value: '#4ba1f1' },
	{ name: 'Yellow', value: '#f1ac4b' },
	{ name: 'Orange', value: '#e16919' },
	{ name: 'Green', value: '#099268' },
	{ name: 'Light green', value: '#4cb05e' },
	{ name: 'Light red', value: '#f87777' },
	{ name: 'Red', value: '#e03131' },
];

export interface InkStrokeSizeOption {
	name: string;
	/** Stored in `InkStrokeStyle.size`. */
	size: number;
}

export const INK_STROKE_SIZES: InkStrokeSizeOption[] = [
	{ name: 'XS', size: 2 },
	{ name: 'S', size: 3 },
	{ name: 'M', size: 4 },
	{ name: 'L', size: 6 },
	{ name: 'XL', size: 8 },
	{ name: '2XL', size: 12 },
];

/** True for a stored `#rrggbb` colour (guards values read back from file metadata). */
export function isCustomInkStrokeColour(color: string): boolean {
	return /^#[0-9a-f]{6}$/i.test(color);
}
