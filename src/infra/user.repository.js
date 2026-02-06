import { UserModel } from '../models/user.model.js';

/**
 * MongoDB (Mongoose) user repository
 */
export class UserRepository {
    async findByEmail(email) {
        return UserModel.findOne({ email }).lean();
    }

    async findById(id) {
        return UserModel.findById(id).lean();
    }

    async create(userData) {
        const user = await UserModel.create(userData);
        return { id: user._id.toString(), email: user.email, passwordHash: user.passwordHash, roles: user.roles, username: user.username };
    }

    async updateById(id, patch) {
        const updated = await UserModel.findByIdAndUpdate(id, patch, { new: true }).lean();
        return updated;
    }
}
