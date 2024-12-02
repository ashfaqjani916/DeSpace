
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BallGame from "./area/ChatComponent";

import LandingPage from "./pages/LandingPage";
import VideoCall from "./components/VideoCall";

const App = () => {


	return (
		<Router>
			<Routes>
				{/* Login Route */}
				<Route path='/' element={<LandingPage />} />
				{/* Home Route */}
				<Route
					path='/home'
					element={
						<div className='relative flex flex-col justify-center  items-center w-full min-h-screen bg-black'>
							{/* Black Mask Overlay */}
							<div className='absolute inset-0 bg-black opacity-50'></div>
							<img
								src='/unfold24-logo3.png'
								className='h-20 top-7 absolute z-50'
							/>
							<div className='grid grid-cols-5 w-full relative pt-20'>
								<div className='col-span-1'>
									<VideoCall />
								</div>

								<div className='col-span-4'>
									<BallGame />
								</div>
							</div>
						</div>
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
