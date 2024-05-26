const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const prisma = new PrismaClient();

const userSchema = z.object({
  name: z.string()
    .min(3, { message: "O nome deve ter pelo menos 3 letras" })
    .regex(/^[A-Za-z]+$/, { message: "O nome deve conter apenas letras" }),
  email: z.string().email({ message: "Email inválido" }),
});

exports.getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

exports.createUser = async (req, res) => {
  try {
    const validatedData = userSchema.parse(req.body);
    const newUser = await prisma.user.create({
      data: validatedData,
    });
    res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json({ errors: e.errors });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const validatedData = userSchema.parse(req.body);
    const updatedUser = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: validatedData,
    });
    res.json(updatedUser);
  } catch (e) {
    res.status(400).json({ errors: e.errors });
  }
};

exports.deleteUser = async (req, res) => {
  const deletedUser = await prisma.user.delete({
    where: { id: Number(req.params.id) },
  });
  res.json(deletedUser);
};
