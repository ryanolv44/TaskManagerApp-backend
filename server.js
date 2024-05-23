const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Esquema de validação Zod
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const taskSchema = z.object({
  title: z.string(),
  completed: z.boolean().optional(),
  userId: z.number(),
});

// Rotas CRUD para Usuários
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req, res) => {
  try {
    const validatedData = userSchema.parse(req.body);
    const newUser = await prisma.user.create({
      data: validatedData,
    });
    res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json(e.errors);
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const validatedData = userSchema.parse(req.body);
    const updatedUser = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: validatedData,
    });
    res.json(updatedUser);
  } catch (e) {
    res.status(400).json(e.errors);
  }
});

app.delete('/users/:id', async (req, res) => {
  const deletedUser = await prisma.user.delete({
    where: { id: Number(req.params.id) },
  });
  res.json(deletedUser);
});

// Rotas CRUD para Tarefas
app.get('/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  try {
    const validatedData = taskSchema.parse(req.body);
    const newTask = await prisma.task.create({
      data: validatedData,
    });
    res.status(201).json(newTask);
  } catch (e) {
    res.status(400).json(e.errors);
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const validatedData = taskSchema.parse(req.body);
    const updatedTask = await prisma.task.update({
      where: { id: Number(req.params.id) },
      data: validatedData,
    });
    res.json(updatedTask);
  } catch (e) {
    res.status(400).json(e.errors);
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const deletedTask = await prisma.task.delete({
    where: { id: Number(req.params.id) },
  });
  res.json(deletedTask);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
