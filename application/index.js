import express from "express";
import cors from 'cors';
import logger from 'morgan';
import './loadWallet';
import registerRoutes from './src/routes/register.routes';
import transferRoutes from './src/routes/transferDrug.routes';
import lifecycleRoutes from './src/routes/lifecycle.routes';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.set('title', 'PharmaNet Distributed Application');
app.use(logger());

app.use('/register', registerRoutes);
app.use('/transfer', transferRoutes);
app.use('/lifecycle', lifecycleRoutes);

app.listen(port, () => console.log('Distributed App listening on port', port));
