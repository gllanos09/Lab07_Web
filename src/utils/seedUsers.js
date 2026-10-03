import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

const ADMIN_EMAIL = 'admin@lab07.com';
const ADMIN_PASSWORD = 'Admin123#';

export default async function seedUsers() {
    const existing = await userRepository.findByEmail(ADMIN_EMAIL);
    if (existing) return;

    const adminRole = await roleRepository.findByName('admin');

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

    await userRepository.create({
        email: ADMIN_EMAIL,
        password: hashed,
        name: 'Administrador',
        lastName: 'General',
        phoneNumber: '999999999',
        birthdate: new Date('1990-01-01'),
        address: 'Lima, Perú',
        roles: [adminRole._id]
    });

    console.log(`Seeded admin user: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}
