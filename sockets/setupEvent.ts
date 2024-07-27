"use server";
import { Server } from "socket.io";
import TrayModel from "@/app/models/TrayModel";

const setupSocketEvents = (io: Server) => {
  io.on("connection", (socket) => {
    console.log(`A client connected with ID: ${socket.id}`);
    socket.emit("server_status", {
      isConnected: true,
      dbConnected: true,
    });
    socket.on("get_trays", async () => {
      try {
        const trays = await TrayModel.find().sort({ _id: -1 });
        socket.emit("tray_update", trays);
      } catch (error) {
        console.error("Error fetching trays:", error);
        socket.emit("fetch_error", { message: "Error fetching trays" });
      }
    });

    socket.on("save_tray", async (data: TrayType, callback) => {
      try {
        const newTray = new TrayModel(data);
        const savedTray = await newTray.save();
        io.emit("tray_update", savedTray);
        if (callback) callback();
      } catch (error) {
        console.error("Error saving tray:", error);
        socket.emit("save_error", { message: "Error saving tray" });
      }
    });

    socket.on("delete_tray", async (id: string) => {
      try {
        await TrayModel.deleteOne({ _id: id });
        io.emit("tray_deleted", id);
      } catch (error) {
        console.error("Error deleting tray:", error);
        socket.emit("delete_error", { message: "Error deleting tray" });
      }
    });
    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });
};

export default setupSocketEvents;

