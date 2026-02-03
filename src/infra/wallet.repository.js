/**
 * Simple in-memory wallet repository
 */
export class WalletRepository {
    constructor() {
        this.wallets = [];
        this.nextId = 1;
    }

    async findById(id) {
        return this.wallets.find((w) => w.id === parseInt(id));
    }

    async create(walletData) {
        const wallet = {
            id: this.nextId++,
            balance: 0,
            ...walletData,
        };
        this.wallets.push(wallet);
        return wallet;
    }

    async save(wallet) {
        const index = this.wallets.findIndex((w) => w.id === wallet.id);
        if (index !== -1) {
            this.wallets[index] = wallet;
        }
        return wallet;
    }
}
