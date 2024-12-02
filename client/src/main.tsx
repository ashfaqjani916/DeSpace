import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
	<GoogleOAuthProvider clientId='727452062096-ce6o67luq1rudeghfri8jv7bd4227cdj.apps.googleusercontent.com'>
		<StrictMode>
			<App />
		</StrictMode>
	</GoogleOAuthProvider>
);
