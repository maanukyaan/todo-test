import { Switch } from '@/components/ui/switch';
import { Todo } from '@/types/todo.type';
import { useState } from 'react';
import Delete from './ui/icons/Delete';
import Edit from './ui/icons/Edit';

const TodoItem: React.FunctionComponent<
	Todo & {
		onToggle: (id: string, newState: boolean) => Promise<void>;
		onEdit: () => void;
		onDelete: () => void;
	}
> = ({ id, title, description, isCompleted, onToggle, onEdit, onDelete }) => {
	const [loading, setLoading] = useState(false);

	const toggleCompleted = async () => {
		if (!loading) {
			const newCompletedState = !isCompleted;

			setLoading(true);
			try {
				await onToggle(id || "", newCompletedState);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div
			className='w-full p-5 flex flex-col justify-between gap-y-3 min-h-[258px] md:w-[30%] bg-red-0 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border border-gray-500 
		bg-[#011522] text-white'
		>
			<div className='flex items-center space-x-2 mb-2'>
				<div className='w-3 h-3 rounded-full bg-[#ff605c]'></div>
				<div className='w-3 h-3 rounded-full bg-[#ffbd44]'></div>
				<div className='w-3 h-3 rounded-full bg-[#00ca4e]'></div>
			</div>
			<h2 className={`font-bold text-2xl overflow-hidden text-ellipsis ${isCompleted ? 'line-through' : ''}`}>
				{title}
			</h2>
			<h3 className={`text-base overflow-hidden text-ellipsis ${isCompleted ? 'line-through' : ''}`}>
				{description}
			</h3>
			<div className='flex items-center justify-between'>
				<div className='flex gap-x-3 items-center'>
					<Switch
						checked={isCompleted}
						id={id?.toString()}
						onClick={toggleCompleted}
						disabled={loading}
					/>
					<label className='text-white opacity-50' htmlFor={id?.toString()}>
						{isCompleted ? 'Выполнено' : 'Не выполнено'}
					</label>
				</div>
				<div className='flex gap-x-3 items-center justify-center'>
					<Edit onClick={onEdit} />
					<Delete onClick={onDelete} />
				</div>
			</div>
		</div>
	);
};

export default TodoItem;
