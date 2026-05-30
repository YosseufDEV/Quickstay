import express from 'express';

import { config } from 'dotenv';
import { prisma } from './db/prisma.ts';

config();

const app = express();
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
