// ============================================================================
// AURA — Autonomous Unified Reasoning Agent
// Express Application Entrypoint
// ============================================================================
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { goalsRouter } from './routes/goals.js';
import { tasksRouter } from './routes/tasks.js';
import { agentsRouter } from './routes/agents.js';
import { plannerRouter } from './routes/planner.js';
import { activityRouter } from './routes/activity.js';
import { dashboardRouter } from './routes/dashboard.js';
import { healthRouter } from './routes/health.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration allowing frontend clients & tunnels
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'apikey'],
}));

app.use(express.json());

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/planner', plannerRouter);
app.use('/api/activity', activityRouter);
app.use('/api/dashboard', dashboardRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[AURA Server Error]:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AURA Agent Engine Server listening on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
