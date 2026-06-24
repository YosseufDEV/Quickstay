import { type RoomType, type RoomStatus, rooms } from "@/src/db/schema";
import drizzle from "@/src/db/drizzle"; 
import { eq } from "drizzle-orm";

interface RoomData {
    hotelId: string;
    pricePerNight: number;
    roomType: RoomType;
    imageUrl: string;
}

class Room {
    static createRoom = async (data: RoomData | RoomData[]) => {
        return await drizzle.insert(rooms).values([data]).returning().then(([room]) => room)!;
    }

    static getRoomById = async (id: string) => {
        return await drizzle.query.rooms.findFirst({
            where: {
                id
            }
        });
    }

    static getRoomsByHotelId = async (hotelId: string) => {
        return await drizzle.query.rooms.findMany({
            where: {
                hotelId
            },
            with: {
                hotel: true
            }
        });
    }

    static updateRoomStatus = async (roomId: string, status: RoomStatus) => {
        return await drizzle.transaction(async (tx) => {
            const [room] = await tx.select().from(rooms).where(eq(rooms.id, roomId)).for('update').execute().catch((err) => {
                throw new Error('room_is_locked');
            });

            if(!room) {
                throw new Error('room_does_not_exist');
            }

            return await tx.update(rooms).set({ status }).where(eq(rooms.id, roomId)).returning();

        })
    }
}

export default Room;
