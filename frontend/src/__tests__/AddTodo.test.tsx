import axios from '@/utils/axiosInstance';
import '@testing-library/jest-dom'; // для дополнительных матчеров, таких как toBeInTheDocument
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { AddTodo } from '../components/AddTodo';

const mock = new MockAdapter(axios);

describe('AddTodo', () => {
	const onTodoAdded = jest.fn();

	beforeEach(() => {
		mock.reset();
	});

	it('должен корректно рендериться', () => {
		render(<AddTodo onTodoAdded={onTodoAdded} />);

		const addButton = screen.getByText('Добавить задачу');
		expect(addButton).toBeInTheDocument();
	});

	it('должен открывать диалог при нажатии на кнопку "Добавить задачу"', () => {
		render(<AddTodo onTodoAdded={onTodoAdded} />);

		const addButton = screen.getByText('Добавить задачу');
		fireEvent.click(addButton);

		const titleInput = screen.getByLabelText('Заголовок');
		expect(titleInput).toBeInTheDocument();
	});

	it('должен отправлять данные и вызывать onTodoAdded при успешной отправке', async () => {
		mock.onPost('/').reply(200);

		render(<AddTodo onTodoAdded={onTodoAdded} />);

		fireEvent.click(screen.getByText('Добавить задачу'));

		fireEvent.change(screen.getByLabelText('Заголовок'), {
			target: { value: 'Новая задача' },
		});
		fireEvent.change(screen.getByLabelText('Описание'), {
			target: { value: 'Описание задачи' },
		});

		fireEvent.click(screen.getByText('Сохранить'));

		await waitFor(() => {
			expect(onTodoAdded).toHaveBeenCalled();
			expect(screen.queryByLabelText('Заголовок')).not.toBeInTheDocument();
		});
	});
});
