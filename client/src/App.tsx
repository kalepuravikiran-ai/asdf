import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { AppShell } from './components/layout/AppShell.js';
import { LandingPage } from './pages/LandingPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { CommandCenterPage } from './pages/CommandCenterPage.js';
import { AgentsPage } from './pages/AgentsPage.js';
import { TasksPage } from './pages/TasksPage.js';
import { PlannerPage } from './pages/PlannerPage.js';
import { ActivityPage } from './pages/ActivityPage.js';
import { SettingsPage } from './pages/SettingsPage.js';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Application Routes wrapped with AppShell */}
          <Route
            path="/dashboard"
            element={
              <AppShell>
                <DashboardPage />
              </AppShell>
            }
          />
          <Route
            path="/command-center"
            element={
              <AppShell>
                <CommandCenterPage />
              </AppShell>
            }
          />
          <Route
            path="/agents"
            element={
              <AppShell>
                <AgentsPage />
              </AppShell>
            }
          />
          <Route
            path="/tasks"
            element={
              <AppShell>
                <TasksPage />
              </AppShell>
            }
          />
          <Route
            path="/planner"
            element={
              <AppShell>
                <PlannerPage />
              </AppShell>
            }
          />
          <Route
            path="/activity"
            element={
              <AppShell>
                <ActivityPage />
              </AppShell>
            }
          />
          <Route
            path="/settings"
            element={
              <AppShell>
                <SettingsPage />
              </AppShell>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
