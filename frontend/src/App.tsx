import TodoList from './components/TodoList';
import { Toaster } from './components/ui/sonner';

const App = () => {
	return (
		<div className='flex flex-col h-dvh w-full relative overflow-hidden'>
			<Video />

			<Toaster theme='dark' />

			<TodoList />

			<Footer />
		</div>
	);
};

export default App;

const Video = () => {
	return (
		<video
			autoPlay
			loop
			muted
			playsInline
			className='absolute top-0 left-0 w-full h-full object-cover -z-10'
		>
			<source src='/sea.mp4' type='video/mp4' />
			Ваш браузер не поддерживает воспроизведение видео.
		</video>
	);
};

const Footer = () => {
	return (
		<div className='w-full bg-gray-100 bg-opacity-15 p-5 mt-5'>
			<h2 className='font-light text-lg text-center text-white'>
				Made with ❤️ by{' '}
				<a
					href='https://t.me/whoiskenshi'
					rel='noopener noreferrer'
					target='_blank'
					className='transition-all hover:underline hover:font-semibold'
				>
					@whoiskenshi
				</a>
			</h2>
		</div>
	);
};
