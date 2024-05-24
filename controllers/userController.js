const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const prisma = new PrismaClient();

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
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
    res.status(400).json(e.errors);
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
    res.status(400).json(e.errors);
  }
};

exports.deleteUser = async (req, res) => {
  const deletedUser = await prisma.user.delete({
    where: { id: Number(req.params.id) },
  });
  res.json(deletedUser);
};
