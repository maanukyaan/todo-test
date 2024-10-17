import cors from 'cors';
import e from 'express';
import { Config, JsonDB } from 'node-json-db';
import { v4 as uuidv4 } from 'uuid';

const PORT = 8080;
const app = e();

app.use(cors());
app.use(e.json());

const db = new JsonDB(new Config('data/todo', true, true));

// POST: Create a new todo
app.post('/todo', async (req, res) => {
	try {
		const todo = { id: uuidv4(), ...req.body };

		const todos = await db.getData('/');
		todos.push(todo);
		await db.push('/', todos);

		res.status(201).send(todo);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

// GET: Retrieve all todos
app.get('/todo', async (req, res) => {
	try {
		const data = await db.getData('/');
		res.send(data);
	} catch (error) {
		if (error.name === 'SyntaxError') {
			res.status(500).send({ error: 'Database is corrupted or empty.' });
		} else {
			res.status(500).send({ error: error.message });
		}
	}
});

// PUT: Update a specific todo by ID
app.put('/todo/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const todos = (await db.getData('/')) || [];
		const index = todos.findIndex(todo => todo.id === id);

		if (index === -1) {
			return res.status(404).send({ error: 'Todo not found.' });
		}

		todos[index] = { ...todos[index], ...req.body };

		await db.push('/', todos);
		res.send(todos[index]);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

// DELETE: Remove all todos
app.delete('/todo', async (req, res) => {
	try {
		await db.push('/', []);
		res.send({ message: 'All todos deleted succesfully.' });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

// DELETE: Remove a specific todo by ID
app.delete('/todo/:id', async (req, res) => {
	try {
		const { id } = req.params;
		let todos = (await db.getData('/')) || [];
		const newTodos = todos.filter(todo => todo.id !== id);

		if (todos.length === newTodos.length) {
			return res.status(404).send({ error: 'Todo not found.' });
		}

		await db.push('/', newTodos);
		res.send({ message: 'Todo deleted successfully.' });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Server successfully started on port ${PORT}`);
});
