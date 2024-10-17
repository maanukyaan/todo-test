function Delete({
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
			stroke={color}
			stroke-width='2'
			stroke-linecap='round'
			stroke-linejoin='round'
		>
			<path d='M3 6h18' />
			<path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
			<path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
		</svg>
	);
}

export default Delete;
