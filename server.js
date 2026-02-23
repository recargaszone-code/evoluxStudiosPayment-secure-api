import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 API KEY protegida no Render ENV
const API_KEY = process.env.RBZIN_API_KEY;

// Função genérica para processar pagamentos
async function processarPagamento(endpoint, metodo, valor, numero) {
  const url = `https://rbzinstore.com/api/${endpoint}`;

  const response = await axios.post(
    url,
    { metodo, valor, numero },
    {
      headers: {
        Authorization: `ApiKey ${API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}

// MPESA
app.post("/pagar/mpesa", async (req, res) => {
  try {
    const { valor, numero } = req.body;
    const data = await processarPagamento(
      "processar_pagamento_api-mpesa",
      "mpesa",
      valor,
      numero
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao processar MPesa" });
  }
});

// EMOLA
app.post("/pagar/emola", async (req, res) => {
  try {
    const { valor, numero } = req.body;
    const data = await processarPagamento(
      "processar_pagamento_api-emola",
      "emola",
      valor,
      numero
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao processar eMola" });
  }
});

// VISA
app.post("/pagar/visa", async (req, res) => {
  try {
    const { valor, numero } = req.body;
    const data = await processarPagamento(
      "processar_pagamento_api-visa",
      "visa",
      valor,
      numero
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao processar Visa" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🔐 RBZIN Secure API rodando na porta " + PORT);
});