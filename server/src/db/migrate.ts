// ============================================================================
// AURA — Autonomous Unified Reasoning Agent
// Supabase Database Migration Runner
// ============================================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { supabase, checkSupabaseStatus } from './supabase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('======================================================');
  console.log('⚡ AURA Database Migration & Health Check Runner');
  console.log('======================================================');

  const migrationFilePath = path.resolve(__dirname, '../../../supabase/migrations/001_initial_schema.sql');
  if (!fs.existsSync(migrationFilePath)) {
    console.error(`❌ Migration file not found at: ${migrationFilePath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(migrationFilePath, 'utf8');
  console.log(`📄 Loaded migration script: 001_initial_schema.sql (${sqlContent.length} bytes)`);

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log(`🔗 Connecting to Supabase Project: ${supabaseUrl}`);
  const status = await checkSupabaseStatus();

  console.log(`📡 Cloud Connection Status: ${status.connected ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`📊 Cloud Public Tables: ${status.tablesExist ? '✅ Initialized & Ready' : '⚠️ Pending Schema Creation'}`);

  if (status.tablesExist) {
    console.log('\n✅ All AURA tables (goals, tasks, agent_activities, schedules) are already active in Supabase Cloud!');
    return;
  }

  console.log('\n------------------------------------------------------');
  console.log('📋 HOW TO APPLY SCHEMA TO YOUR SUPABASE CLOUD PROJECT:');
  console.log('------------------------------------------------------');
  console.log('1. Open your Supabase Dashboard:');
  console.log(`   👉 https://supabase.com/dashboard/project/fosdkjhsfoowiphsuwti/sql`);
  console.log('2. Click "New query" in the SQL Editor.');
  console.log('3. Paste the contents of `supabase/migrations/001_initial_schema.sql`.');
  console.log('4. Click "Run" (Ctrl+Enter).');
  console.log('\n💡 Note: AURA\'s backend includes an automated Resilient Data Engine,');
  console.log('so the application works seamlessly with live simulation even before the SQL is executed!');
  console.log('======================================================\n');
}

runMigration().catch((err) => {
  console.error('Migration runner error:', err);
});
