import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HuddleClient, HuddleProvider } from "@huddle01/react";
import './index.css'
import App from './App.tsx'
const huddleClient = new HuddleClient({
  projectId: import.meta.env.VITE_HUDDLE01_PROJECT_ID!,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HuddleProvider client={huddleClient}>
      <App />
    </HuddleProvider>
  </StrictMode>
);
