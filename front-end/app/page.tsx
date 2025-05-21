"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [qr, setQr] = useState("");
  const [status, setStatus] = useState("");
  const [paymentId, setPaymentid] = useState(null);

  const generateQr = async () => {
    const res = await axios.get("http://localhost:8000");
    setQr(res.data);
    setPaymentid(res.data.id);
  };

  useEffect(() => {
    if (!paymentId) return;
    const ws = new WebSocket("ws://localhost:8000");
    ws.onopen = () => {
      ws.send(JSON.stringify({ message: "hello" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === true) {
        setStatus("QR scanned");
      }
      console.log(JSON.parse(event.data), "event");
    };
    console.log(ws, "ws");
  }, [paymentId]);

  console.log(paymentId);

  return (
    <div>
      <button onClick={generateQr}>Pay</button>
      {qr && <img src={qr} alt="qr"></img>}
      {status && <p className="text-green-500 text-[50px]">{status}</p>}
    </div>
  );
}
