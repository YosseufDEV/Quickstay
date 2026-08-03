import redis from '@/db/redis';


type Response = Record<string, any>

const EXPIRY = 60 * 60 * 24 * 1000; // 24 hours in seconds

class IdempotencyService {
    static async insertIdempotencyKey(key: string, response: Response) {
        await redis.set(`idempotency:${key}`, JSON.stringify(response), { EX: EXPIRY }); // Store for 24 hours
    }

    static async getIdempotencyKey(key: string): Promise<Response | null> {
        const data = await redis.get(`idempotency:${key}`);
        return data ? JSON.parse(data) : null;
    }
}

export default IdempotencyService;
