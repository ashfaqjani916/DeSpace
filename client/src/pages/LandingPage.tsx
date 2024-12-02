import React, { useState } from "react";
import { Menu } from "lucide-react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

// Types
// interface GoogleCredentialResponse {
// 	credential: string;
// }

// interface AuthResponse {
// 	auth_token: string;
// }

function CardHoverEffectDemo() {
	return (
		<div className='max-w-5xl mx-auto px-8'>
			<HoverEffect items={projects} />
		</div>
	);
}

export const projects = [
	{
		title: "Okto",
		description:
			"A decentralized platform designed for managing digital assets and providing secure, efficient DeFi services.",
		link: "https://okto.io",
	},
	{
		title: "Aptos",
		description:
			"A blockchain platform that prioritizes scalability, safety, and upgradability, enabling developers to build next-gen decentralized applications.",
		link: "https://aptoslabs.com",
	},
	{
		title: "Huddle",
		description:
			"A decentralized virtual collaboration platform, enabling teams to connect and work seamlessly in a virtual environment.",
		link: "https://huddle01.com",
	},
	{
		title: "Unfold",
		description:
			"A digital toolkit that helps users create and share stories visually, focusing on clean design and ease of use.",
		link: "https://unfold.com",
	},
	{
		title: "CoinDCX",
		description:
			"A cryptocurrency exchange platform offering secure and lightning-fast trading with a wide range of digital assets.",
		link: "https://coindcx.com",
	},
	{
		title: "Exa Protocol",
		description:
			"A cutting-edge protocol for decentralized data storage and computation, empowering secure and scalable Web3 applications.",
		link: "https://exaprotocol.io",
	},
];

const words = [
	"collaboration",
	"innovation",
	"ideas",
	"creativity",
	"synergy",
	"productivity",
	"connection",
	"freedom",
];

const API_KEY = "e987fc5b-e39b-4516-b9de-dc419f545684"; // Replace with your actual API key
const API_URL = "http://localhost:3000/okto-sandbox/authenticate";

const LandingPage: React.FC = () => {
	const [authToken, setAuthToken] = useState("");
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();



	const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
		try {
			console.log("Google login response:", credentialResponse);
			const idToken = credentialResponse.credential;

			if (!idToken) {
				setError("No ID token received from Google");
				return;
			}

			const response = await fetch(API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Api-Key": API_KEY,
				},
				body: JSON.stringify({
					id_token: idToken,
				}),
			});

			console.log(response)
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: any = await response.json();



			if (data.data.auth_token) {
				console.log("Authentication successful");
				setAuthToken(data.data.auth_token);
				localStorage.setItem("okto_auth_token", data.data.auth_token);
				setError("");
				navigate("/home");
			} else {
				setError("No auth token received from Okto");
			}
		} catch (error) {
			console.error("Login process failed:", error);
			setError("Authentication failed. Please try again.");
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("okto_auth_token");
		setAuthToken("");
		navigate("/");
	};

	return (
		<div>
			<div className='min-h-screen bg-[#020817] text-white'>
				<nav className='container mx-auto px-4 py-2 flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<img
							src='/logo.png'
							alt='DeSpace Logo'
							className='h-48 W-48 w-auto'
						/>
					</div>

					<div className='hidden md:flex items-center gap-16'>
						<a href='#'>
							<div className='flex items-center gap-1 cursor-pointer font-bold'>
								Resources
							</div>
						</a>
						<a href='#about' className='hover:text-gray-300 font-bold'>
							About Us
						</a>
						<a href='#node-sale' className='hover:text-gray-300 font-bold'>
							Features
						</a>
					</div>

					<div className='flex items-center gap-4'>
						<div style={{ marginBottom: "20px" }}>
							{!authToken ? (
								<div>
									<GoogleLogin
										onSuccess={handleGoogleLogin}
										useOneTap
										promptMomentNotification={(notification) =>
											console.log("Prompt moment notification:", notification)
										}
									/>
									{error && <p className='text-red-500 mt-2'>{error}</p>}
								</div>
							) : (
								<div>
									<p>You are currently logged in</p>
									<button
										onClick={handleLogout}
										className='px-5 py-2.5 text-base rounded bg-red-500 hover:bg-red-600 transition-colors'
									>
										Logout
									</button>
								</div>
							)}
						</div>
						<button className='md:hidden text-white'>
							<Menu className='h-6 w-6' />
						</button>
					</div>
				</nav>

				<main className='container mx-auto px-4 py-20 text-center'
				>
					{/* <div
						className='absolute inset-0 bg-black opacity-50'
						style={{
							backgroundImage: "url('preview2.png')",
							backgroundSize: 'cover',
						}}
					></div> */}
					<h1 className='text-4xl md:text-9xl font-bold mb-6 leading-tight'>
						DeSpace
						<br />
					</h1>
					<div className='flex justify-center items-center px-4 mb-8'>
						<div className='text-4xl mx-auto font-normal text-neutral-600 '>
							Where
							<FlipWords words={words} />
							meets Decentralization
						</div>
					</div>

					<div className='flex flex-col md:flex-row gap-4 justify-center mb-48'>
						<button className='bg-white text-gray-900 hover:bg-gray-100 font-bold py-2 px-4 rounded'>
							Get Started
						</button>
					</div>
				</main>

				<section className='w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]'>
					<ul className='flex items-center justify-center md:justify-start mx-auto gap-8 animate-infinite-scroll'>
						<li>
							<img
								src='/OktoLogo.png'
								alt='Facebook'
								className='w-24'
							/>
						</li>
						<li>
							<img
								src='/aptos-logo.png'
								alt='Disney'
								className='h-32'
							/>
						</li>
						<li>
							<img
								src='/CoinDCX-Logo.png'
								alt='Airbnb'
								className='w-32'
							/>
						</li><li>
							<img
								src='/unfold-nobg.png'
								alt='Spark'
								className='h-24'
							/>
						</li>
						<li>
							<img
								src='/sui-sui-logo.png'
								alt='Apple'
								className='h-16'
							/>
						</li>

						<li>
							<img
								src='/huddle.png'
								alt='Samsung'
								className='h-24'
							/>
						</li>

					</ul>
				</section>
			</div>

			<div className='min-h-screen bg-black'>
				{/* Hero Section */}
				<section className='px-4 py-20 text-center'>
					<h1 className='max-w-4xl mx-auto text-4xl font-bold tracking-tight text-gray-300 sm:text-5xl'>
						The in-person moments you've been missing
					</h1>
				</section>

				{/* Feature Section 1: Proximity and Visibility */}
				<section className='px-4 py-16 text-gray-400'>
					<div className='max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 items-center'>
						<div>
							<div className='text-indigo-600 font-medium mb-2'>
								PROXIMITY AND VISIBILITY
							</div>
							<h2 className='text-3xl font-bold text-navy-900 mb-4'>
								Bring your remote team closer together
							</h2>
							<p className='text-gray-600'>
								Communicate, collaborate, and feel more connected in a
								persistent space that reflects your unique team culture.
							</p>
						</div>
						<div className='relative'>
							<div className='rounded-lg shadow-lg overflow-hidden'>
								<img
									src='https://cdn.prod.website-files.com/63c885e8fb810536398b658a/643efaed7bdd2933eec28371_home%20proximity.png?height=400&width=600'
									alt='Remote team collaboration interface'
									className='w-full h-auto'
								/>
								<div className='absolute right-0 top-0 bottom-0 w-1/3 bg-navy-800 p-4'>
									<div className='space-y-4'>
										<div className='p-2 bg-navy-700 rounded text-white text-sm'>
											Remote office
										</div>
										<div className='p-2 bg-navy-700 rounded text-white text-sm'>
											Team social
										</div>
										<div className='p-2 bg-navy-700 rounded text-white text-sm'>
											All hands
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Feature Section 2: Serendipitous Moments */}
				<section className='px-4 py-16'>
					<div className='max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 items-center'>
						<div className='order-2 lg:order-1'>
							<div className='text-gray-400 rounded-lg shadow-lg overflow-hidden'>
								<img
									src='https://cdn.prod.website-files.com/63c885e8fb810536398b658a/643efaed7bdd2933eec28371_home%20proximity.png?height=400&width=600'
									alt='Natural communication interface'
									className='w-full h-auto'
								/>
							</div>
						</div>
						<div className='order-1 lg:order-2'>
							<div className='text-indigo-600 font-medium mb-2'>
								SERENDIPITOUS MOMENTS
							</div>
							<h2 className='text-3xl font-bold text-gray-50 mb-4'>
								Talk naturally throughout your day
							</h2>
							<p className='text-gray-600'>
								Stop by someone's desk, say hi in the hallway, and bring back
								water cooler chats. No scheduling required.
							</p>
						</div>
					</div>
				</section>

				{/* Feature Section 3: Productive Conversations */}
				<section className='px-4 py-16 text-gray-400'>
					<div className='max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 items-center'>
						<div>
							<div className='text-indigo-600 font-medium mb-2'>
								PRODUCTIVE CONVERSATIONS
							</div>
							<h2 className='text-3xl font-bold text-navy-900 mb-4'>
								Meet in the moment
							</h2>
							<p className='text-gray-600'>
								Collaborate in the moment or schedule team meetings to keep
								everyone aligned and work moving forward.
							</p>
						</div>
						<div>
							<div className='rounded-lg shadow-lg overflow-hidden'>
								<img
									src='https://cdn.prod.website-files.com/63c885e8fb810536398b658a/643efaed7bdd2933eec28371_home%20proximity.png?height=400&width=600'
									alt='Team meeting interface'
									className='w-full h-auto'
								/>
							</div>
						</div>
					</div>
				</section>
				<CardHoverEffectDemo />
				<Footer />
			</div>
		</div>
	);
};

export default LandingPage;
