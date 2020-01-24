// Imports

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";

// Routes handler
import apiRoutes from './routes';

dotenv.config();



//  Inicializar variables

const app = express();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());

// ================= API ROUTES v1 ==============================
app.use('/', apiRoutes);

// Escuchar Peticiones
const port = Number(process.env.PORT) | 3000;

app.listen(port, () => {
    console.log(`Escuchando en puerto ${port}: \x1b[32m%s\x1b[0m`, 'online');
});