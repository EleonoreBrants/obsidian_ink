import './style-menu.scss';
import * as React from 'react';
import classNames from 'classnames';
import type { InkCanvasEditor } from 'src/ink-canvas/types';
import { INK_STROKE_COLOURS, INK_STROKE_SIZES } from 'src/ink-canvas/stroke-palette';

//////////
//////////

interface InkCanvasStyleMenuProps {
	getEditor: () => InkCanvasEditor | undefined;
	onStyleChange?: () => void;
}

type OpenPicker = 'color' | 'size' | null;

const DEFAULT_COLOUR_VALUE = INK_STROKE_COLOURS[0].value;

export const InkCanvasStyleMenu = React.forwardRef<HTMLDivElement, InkCanvasStyleMenuProps>((props, ref) => {

	const [currentColour, setCurrentColour] = React.useState<string>(DEFAULT_COLOUR_VALUE);
	const [currentSize, setCurrentSize] = React.useState<number>(INK_STROKE_SIZES[2].size);
	const [openPicker, setOpenPicker] = React.useState<OpenPicker>(null);
	const menuElRef = React.useRef<HTMLDivElement>(null);

	// The editor mounts after this menu and its style can change elsewhere, so mirror it.
	React.useEffect(() => {
		const intervalId = window.setInterval(() => {
			const style = props.getEditor()?.getStrokeStyle();
			if (!style) return;
			setCurrentColour(style.color);
			setCurrentSize(style.size);
		}, 200);
		return () => window.clearInterval(intervalId);
	}, []);

	React.useEffect(() => {
		if (!openPicker) return;
		const closeOnOutsidePointer = (e: PointerEvent) => {
			if (menuElRef.current?.contains(e.target as Node)) return;
			setOpenPicker(null);
		};
		document.addEventListener('pointerdown', closeOnOutsidePointer);
		return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
	}, [openPicker]);

	///////////

	function selectColour(value: string) {
		props.getEditor()?.setStrokeStyle({ color: value });
		setCurrentColour(value);
		setOpenPicker(null);
		props.onStyleChange?.();
	}

	function selectSize(size: number) {
		props.getEditor()?.setStrokeStyle({ size });
		setCurrentSize(size);
		setOpenPicker(null);
		props.onStyleChange?.();
	}

	function togglePicker(picker: Exclude<OpenPicker, null>) {
		setOpenPicker(prev => (prev === picker ? null : picker));
	}

	///////////
	///////////

	return <>
		<div
			ref={ref}
			className={classNames([
				'ink_menu-bar',
				'ink_menu-bar_floating',
			])}
		>
			<div ref={menuElRef} className='ink_style-menu'>
				<div className='ink_style-menu-item'>
					<button
						onClick={() => togglePicker('color')}
						className='ink_color-button'
						title='Pen colour'
					>
						<div
							className='ink_color-indicator'
							style={{ backgroundColor: displayColour(currentColour) }}
						/>
					</button>
					{openPicker === 'color' && (
						<div className='ink_style-picker ink_color-picker'>
							{INK_STROKE_COLOURS.map((colour) => (
								<button
									key={colour.value}
									className={classNames([
										'ink_color-option',
										currentColour === colour.value && 'ink_active',
									])}
									style={{ backgroundColor: displayColour(colour.value) }}
									onClick={() => selectColour(colour.value)}
									title={colour.name}
								/>
							))}
						</div>
					)}
				</div>

				<div className='ink_style-menu-item'>
					<button
						onClick={() => togglePicker('size')}
						className='ink_size-button'
						title='Stroke width'
					>
						<div className='ink_size-indicator'>
							<div
								className='ink_size-line'
								style={{ height: `${sizeIndicatorHeightEm(currentSize)}em` }}
							/>
						</div>
					</button>
					{openPicker === 'size' && (
						<div className='ink_style-picker ink_size-picker'>
							{INK_STROKE_SIZES.map((option) => (
								<button
									key={option.size}
									className={classNames([
										'ink_size-option',
										currentSize === option.size && 'ink_active',
									])}
									onClick={() => selectSize(option.size)}
									title={option.name}
								>
									<div
										className='ink_size-preview'
										style={{ height: `${sizeIndicatorHeightEm(option.size)}em` }}
									/>
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	</>;
});

export default InkCanvasStyleMenu;

// Helpers
///////////

/** Swatch colour; the dark-theme variants are applied to canvas strokes only, so swatches use the stored value. */
function displayColour(value: string): string {
	return value === 'currentColor' ? 'var(--text-normal)' : value;
}

function sizeIndicatorHeightEm(size: number): number {
	return Math.min(size * 0.1, 1.2);
}
