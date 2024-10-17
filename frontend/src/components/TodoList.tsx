import { defaultTodos } from '@/assets/defaultTodos';
import { Button } from '@/components/ui/button';
import { Todo } from '@/types/todo.type';
import axios from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AddTodo } from './AddTodo';
import EditTodo from './EditTodo';
import TodoItem from './TodoItem';

function TodoList() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [completedTodos, setCompletedTodos] = useState<string[]>([]);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

	const fetchTodos = async () => {
		const { data } = await axios.get('');
		if (Array.isArray(data)) {
			setTodos(data);
			setCompletedTodos(
				data.filter(todo => todo.isCompleted).map((todo: Todo) => todo.id ?? '')
			);
		}
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	const pushDefaultTodo = async () => {
		const randomTodo =
			defaultTodos[Math.floor(Math.random() * defaultTodos.length)];

		toast.promise(axios.post('', randomTodo), {
			loading: 'Добавление дефолтной задачи...',
			success: () => {
				fetchTodos();
				return 'Вы успешно добавили новую задачу';
			},
			error: error => {
				console.error('Failed to upload default todo:', error);
				return 'Ошибка при добавлении дефолтной задачи';
			},
		});
	};

	const toggleTodo = async (id: string, newState: boolean) => {
		const todoToUpdate = todos.find(todo => todo.id === id);
		if (todoToUpdate) {
			const updatedTodo = {
				...todoToUpdate,
				isCompleted: newState,
			};

			toast.promise(axios.put(id, updatedTodo), {
				loading: 'Обновление задачи...',
				success: () => {
					setTodos(prevTodos =>
						prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
					);
					if (newState) {
						setCompletedTodos(prev => [...prev, id]);
						return `Задача "${todoToUpdate.title}" помечена выполненной`;
					} else {
						setCompletedTodos(prev => prev.filter(todoId => todoId !== id));
						return `Задача "${todoToUpdate.title}" помечена как не выполненная`;
					}
				},
				error: error => {
					console.error('Failed to update todo:', error);
					return 'Ошибка при обновлении задачи';
				},
			});
		}
	};

	const handleEdit = (id: string) => {
		const todoToEdit = todos.find(todo => todo.id === id);
		if (todoToEdit) {
			setCurrentTodo(todoToEdit);
			setIsDialogOpen(true);
		}
	};

	const handleUpdate = (updatedTodo: Todo) => {
		setTodos(prevTodos =>
			prevTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))
		);
	};

	const handleDelete = async (id: string) => {
		toast.promise(axios.delete(id), {
			loading: 'Удаление задачи...',
			success: () => {
				setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
				setCompletedTodos(prev => prev.filter(todoId => todoId !== id));
				return 'Задача удалена';
			},
			error: error => {
				console.error('Ошибка при удалении задачи:', error);
				return 'Ошибка при удалении задачи';
			},
		});
	};

	const clearCompleted = async () => {
		const promises = completedTodos.map(id =>
			axios
				.delete(id)
				.then(() => console.log(`Deleted todo with ID: ${id}`))
				.catch(err =>
					console.error(`Failed to delete todo with ID: ${id}`, err)
				)
		);

		// Ждем завершения всех запросов
		toast.promise(Promise.all(promises), {
			loading: 'Удаление выполненных задач...',
			success: async () => {
				setCompletedTodos([]);
				await fetchTodos();
				return 'Все выполненные задачи удалены!';
			},
			error: error => {
				console.error('Ошибка при удалении выполненных задач:', error);
				return 'Ошибка при очистке выполненных задач';
			},
		});
	};

	const deleteAllTodos = async () => {
		const promise = axios.delete('');

		toast.promise(promise, {
			loading: 'Удаление всех задач...',
			success: () => {
				setTodos([]);
				setCompletedTodos([]);
				return 'Все задачи успешно удалены!';
			},
			error: error => {
				console.error('Ошибка при удалении всех задач:', error);
				return 'Ошибка при удалении всех задач';
			},
		});
	};

	return (
		<div className='flex flex-col items-center justify-center grow'>
			<div className='scroll-container w-full flex flex-nowrap flex-col items-center justify-start md:justify-center gap-5 p-5 sm:flex-wrap sm:flex-row max-h-[45vh] md:max-h-[65vh] overflow-scroll'>
				{todos.length < 1 ? (
					<RandomMessage />
				) : (
					todos.map(todo => (
						<>
							<TodoItem
								key={todo.id}
								id={todo.id}
								title={todo.title}
								description={todo.description}
								isCompleted={todo.isCompleted}
								onToggle={toggleTodo}
								onEdit={() => handleEdit(todo.id ?? '')}
								onDelete={() => handleDelete(todo.id ?? '')}
							/>
						</>
					))
				)}
			</div>

			<EditTodo
				todo={currentTodo}
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onUpdate={handleUpdate}
			/>

			<div className='flex flex-col md:flex-row items-center justify-center gap-3 sm:flex-row mt-5'>
				<Button variant='default' onClick={pushDefaultTodo}>
					Добавить дефолтную задачу
				</Button>

				{completedTodos.length > 0 && (
					<Button variant='outline' onClick={clearCompleted}>
						Очистить выполненные задачи
					</Button>
				)}

				{todos.length > 1 && (
					<Button variant='default' onClick={deleteAllTodos}>
						Удалить все задачи
					</Button>
				)}
			</div>

			<AddTodo onTodoAdded={fetchTodos} />
		</div>
	);
}

export default TodoList;

const RandomMessage = () => {
	const [message, setMessage] = useState('');

	useEffect(() => {
		const messages = [
			'Пустота — отличная точка для старта 🌌\nДобавим что-то новое? ✏️',
			'Список чист, как новая тетрадь 📓\nНачнём что-то важное? 📝',
			'Всё завершено! 🌅\nДавай придумаем что-то новое? ✂️',
			'Все задачи выполнены. 🎯\nВремя для новых идей. 📌',
			'Список задач пуст. 📋\nГотовы к новым вызовам? ✏️',
			'Отличная работа! ✨\nДавайте добавим что-то интересное. 📖',
			'Всё завершено! 🌿\nКак насчет новой задачи? 🔍',
			'Всё выполнено. 🌟\nЕсть идеи для следующей задачи? ✏️',
		];

		const randomIndex = Math.floor(Math.random() * messages.length);
		setMessage(messages[randomIndex]);
	}, []);

	return (
		<h2 className='font-semibold text-3xl text-center text-white'>
			{message.split('\n').map((line, index) => (
				<span key={index} className='block'>
					{line}
				</span>
			))}
		</h2>
	);
};
