import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando sembrado...')

  // Categorías
  const catBazar = await prisma.category.upsert({
    where: { slug: 'bazar' },
    update: {},
    create: { name: 'Bazar', slug: 'bazar' },
  })
  
  await prisma.category.upsert({
    where: { slug: 'espejos' },
    update: {},
    create: { name: 'Espejos', slug: 'espejos' },
  })

  // Admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@esmae.com' },
    update: {},
    create: {
      name: 'Admin Nico',
      email: 'admin@esmae.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Producto
  await prisma.product.upsert({
    where: { slug: 'jarra-estriada' },
    update: {},
    create: {
      name: 'Jarra Estriada',
      slug: 'jarra-estriada',
      description: 'Vidrio soplado artesanal.',
      price: 15400,
      stock: 10,
      material: 'Vidrio Soplado',
      dimensions: '1.5 Litros',
      categoryId: catBazar.id,
      images: {
        create: [{ url: 'https://via.placeholder.com/600x800' }]
      }
    },
  })

  console.log('✅ Base de datos sembrada con éxito.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })