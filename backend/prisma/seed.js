import prisma from '../src/lib/prisma.js';

async function main() {
  // Asegurar que el rol Admin existe (id 1)
  await prisma.rol.upsert({
    where: { id: 1 },
    update: { rol: 'Admin' },
    create: { id: 1, rol: 'Admin' },
  });

  // Asegurar que el rol Usuario existe (id 2) — userService busca 'Usuario'/'usuario'
  await prisma.rol.upsert({
    where: { id: 2 },
    update: { rol: 'Usuario' },
    create: { id: 2, rol: 'Usuario' },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })