/**
 * Simple in-memory user repository
 */
export class UserRepository {
    constructor() {
        this.users = [];
        this.nextId = 1;
    }

    async findByEmail(email) {
        return this.users.find((u) => u.email === email);
    }

    async findById(id) {
        return this.users.find((u) => u.id === id);
    }

    async create(userData) {
        const user = {
            id: this.nextId++,
            ...userData,
        };
        this.users.push(user);
        return user;
    }
}
