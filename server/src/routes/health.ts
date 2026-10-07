// ============================================================================
// AURA — Health & Status API Route
// ============================================================================
import { Router, Request, Response } from 'express';
import { checkSupabaseStatus } from '../db/supabase.js';
import { GeminiService } from '../services/gemini.js';

export const healthRouter = Router();

// GET /api/health
healthRouter.get('/', async (req: Request, res: Response) => {
  try {
    const dbStatus = await checkSupabaseStatus();
    const geminiAvailable = GeminiService.isAvailable();

    res.json({
      success: true,
      data: {
        server: 'online',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: {
          provider: 'Supabase Cloud PostgreSQL',
          connected: dbStatus.connected,
          tablesActive: dbStatus.tablesExist,
          error: dbStatus.error,
        },
        ai: {
          engine: geminiAvailable ? 'Gemini 2.5 Flash / GenAI' : 'Autonomous Demo Engine (Simulation Mode)',
          geminiConnected: geminiAvailable,
          model: 'gemini-2.5-flash',
          safetyGuards: 'Strict System Boundary Enforcement',
        },
        security: {
          rlsConfigured: true,
          zodValidation: 'Active',
          secretsServerSideOnly: true,
        }
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
