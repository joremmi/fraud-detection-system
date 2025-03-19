import { Router } from 'express';
import { getConnection } from 'typeorm';
import { cacheClient } from './config/cache';

const healthRouter = Router();

healthRouter.get('/health', async (req, res) => {
  try {
    // Database check
    await getConnection().query('SELECT 1');
    
    // Cache check
    await cacheClient.ping();
    
    // ML Service check
    const mlHealth = await fetch('http://ml_service:5001/health');
    
    res.json({
      status: 'healthy',
      database: 'connected',
      cache: 'connected',
      mlService: mlHealth.ok ? 'healthy' : 'unhealthy'
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ status: 'unhealthy', error: errorMessage });
  }
});

export default healthRouter;