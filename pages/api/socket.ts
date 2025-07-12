import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "@/types/socket.types";
import { setIO, getIO } from "@/lib/socket";
import { db } from "@/lib/db"; // Prisma client

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!getIO()) {
    console.log("🧩 Inicializando Socket.IO...");

    const httpServer: HTTPServer = res.socket.server as any;
    const io = new IOServer(httpServer, {
      path: "/api/socket",
    });

    setIO(io);

    io.on("connection", (socket) => {
      console.log("🟢 Nuevo cliente conectado:", socket.id);

      socket.on("join-global", (userId) => {
        socket.join(`user-${userId}`);
        console.log(
          `🌎​​ Cliente ${socket.id} unido a sala global: user-${userId}`
        );
      });

      socket.on("join-room", (conversationId) => {
        socket.join(conversationId);
        console.log(`📥 Cliente ${socket.id} unido a sala: ${conversationId}`);
      });

      socket.on("typing", ({ conversationId, isTyping }) => {
        socket.to(conversationId).emit("typing", { conversationId, isTyping });
      });

      socket.on("mark-as-read", async ({ conversationId, userId }) => {
        try {
          // Marcar como leídos los mensajes de esa conversación que no fueron enviados por este usuario
          await db.message.updateMany({
            where: {
              conversationId,
              receiverId: userId,
              read: false,
            },
            data: {
              read: true,
            },
          });

          // Emitir a la sala que los mensajes fueron leídos
          socket.to(conversationId).emit("messages-read", { conversationId });
        } catch (error) {
          console.error("❌ Error al marcar mensajes como leídos:", error);
        }
      });

      socket.on("new-story", async ({ storyId, authorId }) => {
        try {
          const followers = await db.follower.findMany({
            where: { followingId: authorId },
            select: { followerId: true },
          });

          for (const follower of followers) {
            io.to(`user-${follower.followerId}`).emit("new-story", { storyId });
          }
        } catch (err) {
          console.error("❌ Error al emitir nueva historia:", err);
        }
      });

      socket.on("disconnect", () => {
        console.log("🔴 Cliente desconectado:", socket.id);
      });
    });
  }

  res.end();
}
