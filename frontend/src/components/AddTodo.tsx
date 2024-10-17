import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from '@/utils/axiosInstance';
import { useState } from 'react';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';

interface AddTodoProps {
	onTodoAdded: () => void;
}

export function AddTodo({ onTodoAdded }: AddTodoProps) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [open, setOpen] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!title || !description) {
			toast.error('Пожалуйста, заполните все поля.');
			return;
		}

		const newTodo = {
			title,
			description,
			isCompleted: false,
		};

		toast.promise(axios.post('', newTodo), {
			loading: 'Добавление задачи...',
			success: async () => {
				setTitle('');
				setDescription('');
				setOpen(false);
				onTodoAdded();
				return `Задача "${title}" успешно добавлена!`;
			},
			error: error => {
				console.error('Ошибка при добавлении задачи:', error);
				return `Ошибка при добавлении задачи "${title}".`;
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='default' className='mx-auto mt-5'>
					Добавить задачу
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Добавить задачу</DialogTitle>
					<DialogDescription>
						Введите необходимую информацию о задаче: заголовок и описание
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='grid gap-4 py-4'>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='name' className='text-right'>
							Заголовок
						</Label>
						<Input
							id='name'
							value={title}
							onChange={e => setTitle(e.target.value)}
							className='col-span-3'
						/>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='description' className='text-right'>
							Описание
						</Label>
						<Textarea
							id='description'
							value={description}
							onChange={e => setDescription(e.target.value)}
							className='col-span-3'
						/>
					</div>
					<DialogFooter>
						<Button type='submit'>Сохранить</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
