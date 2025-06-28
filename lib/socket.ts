import { Server as IOServer } from "socket.io";

type GlobalWithIO = typeof globalThis & {
  _io?: IOServer;
};

const g = globalThis as GlobalWithIO;

export function setIO(io: IOServer) {
  g._io = io;
}

export function getIO(): IOServer | undefined {
  return g._io;
}
