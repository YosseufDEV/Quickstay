import { type RoomStatus, rooms } from "@/db/schema";
import drizzle from "@/db/drizzle"; 
import { and, eq } from "drizzle-orm";
import { AppError } from "@/errors/errors";

interface RoomData {
    hotelId: string
    roomNumber: number
    roomType: string
}

class Room {
    static createRoom = async (data: RoomData | RoomData[]) => {
        return await drizzle.insert(rooms).values(Array.isArray(data) ? data : [data]).returning().then(([room]) => room)!;
    }

    static getRoomById = async (id: string) => {
        return await drizzle.query.rooms.findFirst({
            where: {
                id
            }
        });
    }

    static getRoomsByHotelId = async (hotelId: string, availableOnly?: boolean) => {
        const allRooms =  drizzle.query.rooms.findMany({
            where: {
                hotelId: hotelId,
                ...(availableOnly ? { status: 'AVAILABLE' } : {})
            },
            // with: {
            //     hotel: true
            // }
        });

        return await (allRooms);
    }

    static updateRoomStatus = async (roomId: string, status: RoomStatus) => {
        return await drizzle.transaction(async (tx) => {
            const [room] = await tx.select().from(rooms).where(eq(rooms.id, roomId)).for('update').execute().catch((err) => {
                // TODO: Throw a custom error RoomError
                throw new AppError('room_is_locked');
            });

            if(!room) {
                throw new AppError('room_does_not_exist');
            }

            return await tx.update(rooms).set({ status }).where(eq(rooms.id, roomId)).returning();

        })
    }
}

export default Room;
