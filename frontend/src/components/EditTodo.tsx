import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Todo } from '@/types/todo.type';
import axios from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EditTodoProps {
	todo: Todo | null;
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (updatedTodo: Todo) => void;
}

const EditTodo: React.FC<EditTodoProps> = ({
	todo,
	isOpen,
	onClose,
	onUpdate,
}) => {
	const [newTitle, setNewTitle] = useState('');
	const [newDescription, setNewDescription] = useState('');

	// Подстановка текущих значений туду при открытии диалога
	useEffect(() => {
		if (todo) {
			setNewTitle(todo.title);
			setNewDescription(todo.description);
		}
	}, [todo, isOpen]);

	const saveChanges = async () => {
		// Валидация: проверяем, что поля не пустые
		if (!newTitle || !newDescription) {
			toast.error('Название и описание не могут быть пустыми.');
			return;
		}

		if (todo) {
			const updatedTodo = {
				...todo,
				title: newTitle,
				description: newDescription,
			};

			toast.promise(axios.put(todo.id || '', updatedTodo), {
				loading: 'Обновление задачи...',
				success: () => {
					onUpdate(updatedTodo); // Вызываем переданный обработчик обновления
					onClose(); // Закрываем диалог
					return `Задача "${newTitle}" обновлена`;
				},
				error: error => {
					console.error('Failed to update todo:', error);
					return 'Ошибка при обновлении задачи';
				},
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Редактировать задачу</DialogTitle>
					<DialogDescription>
						Внесите изменения в вашу задачу.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='title' className='text-right'>
							Название
						</Label>
						<Input
							id='title'
							value={newTitle}
							onChange={e => setNewTitle(e.target.value)}
							className='col-span-3'
						/>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='description' className='text-right'>
							Описание
						</Label>
						<Input
							id='description'
							value={newDescription}
							onChange={e => setNewDescription(e.target.value)}
							className='col-span-3'
						/>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={saveChanges}>Сохранить изменения</Button>
					<Button onClick={onClose}>Отмена</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditTodo;
