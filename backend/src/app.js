import express from 'express';
import cors from 'cors';
import categoriasRouter from './routes/categorias.js';
import receitasRouter from './routes/receitas.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// --- Middleware global (antes das rotas) ---
app.use(cors({                                // ← novo
  origin: ['http://localhost:5501', 'http://127.0.0.1:5501'],
}));
app.use(express.json()); // lê o body JSON para req.body
app.use(logger);         // loga toda requisição

// --- Health check ---
app.get('/', (req, res) => {
  res.json({
    api: 'Catálogo de Receitas API',
    versao: '1.0.0',
    rotas: ['/categorias', '/receitas'],
  });
});

// --- Rotas ---
app.use('/categorias', categoriasRouter);
app.use('/receitas', receitasRouter);

// --- 404 para rotas que não existem ---
app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

// --- Tratador de erro: SEMPRE o último ---
app.use(errorHandler);

export default app;