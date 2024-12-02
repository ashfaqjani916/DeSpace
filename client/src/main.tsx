import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HuddleClient, HuddleProvider } from "@huddle01/react";
import "./index.css";
import App from "./App.tsx";
import { ModalProvider } from "./components/animated-model.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
const huddleClient = new HuddleClient({
	projectId: import.meta.env.VITE_HUDDLE01_PROJECT_ID!,
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<GoogleOAuthProvider clientId="727452062096-ce6o67luq1rudeghfri8jv7bd4227cdj.apps.googleusercontent.com">
			<ModalProvider>
				<HuddleProvider client={huddleClient}>
					<App />
				</HuddleProvider>
			</ModalProvider>
		</GoogleOAuthProvider>
	</StrictMode>
);
