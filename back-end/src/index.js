import express, { json } from "express";
import cors from "cors";
import QRCode from "qrcode";
import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";

const app = express();
const port = 8000;

app.use(cors());
app.use(json());
let status = false;

app.get("/", async (req, res) => {
  const qr = await QRCode.toDataURL("http://localhost:8000/scanQR");
  const id = uuid();
  res.send(qr, id);
});

app.get("/scanQr", (req, res) => {
  status = true;
  res.send("qr scanned");
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//server front endtei holboh websocket

const ws = new WebSocketServer({ server });

ws.on("connection", (socket) => {
  console.log("connected");
  socket.on("message", (values) => {
    const parsed = JSON.parse(values);
    console.log(parsed);
  });
  socket.send(JSON.stringify({ message: "success", status: status }));
});
