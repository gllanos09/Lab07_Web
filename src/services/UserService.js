import userRepository from '../repositories/UserRepository.js';

class UserService {

    _toPublic(user) {
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            birthdate: user.birthdate,
            age: user.age,
            url_profile: user.url_profile,
            address: user.address,
            roles: user.roles.map(r => r.name),
            createdAt: user.createdAt
        };
    }

    async getAll() {
        const users = await userRepository.getAll();
        return users.map(u => this._toPublic(u));
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return this._toPublic(user);
    }

    async updateProfile(id, data) {
        const { name, lastName, phoneNumber, birthdate, url_profile, address } = data;
        const updated = await userRepository.updateProfile(id, { name, lastName, phoneNumber, birthdate, url_profile, address });
        if (!updated) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return this._toPublic(updated);
    }
}

export default new UserService();
