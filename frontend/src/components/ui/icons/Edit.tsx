function Edit({
	color = '#f1f1f1',
	size = 22,
	onClick,
}: {
	color?: string;
	size?: number;
	onClick?: () => void;
}) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			className='cursor-pointer'
			onClick={onClick}
			viewBox='0 0 24 24'
			fill='none'
			stroke={`${color}`}
			stroke-width='2'
			stroke-linecap='round'
			stroke-linejoin='round'
		>
			<path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' />
			<path d='m15 5 4 4' />
		</svg>
	);
}

export default Edit;
