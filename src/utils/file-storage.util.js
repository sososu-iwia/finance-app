import fs from 'fs/promises';
import path from 'path';

export class FileStorage {
    constructor(filePath) {
        this.filePath = path.resolve(process.cwd(), filePath);
        this.writeQueue = Promise.resolve();
    }

    async read() {
        try {
            const content = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    async write(data) {
        this.writeQueue = this.writeQueue.then(async () => {
            const dir = path.dirname(this.filePath);
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
        });

        return this.writeQueue;
    }
}
