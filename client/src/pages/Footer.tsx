import { Facebook, Twitter, Linkedin, Instagram } from "react-feather";

export default function Footer() {
	return (
		<footer className='bg-black text-gray-100 after: py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8'>
					{/* Logo and Company Info */}
					<div className='lg:col-span-2'>
						<div className='flex items-center space-x-2 mb-4'>
							<div className='w-6 h-6'>
								<svg viewBox='0 0 24 24' className='w-full h-full'>
									<path
										fill='currentColor'
										d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
									/>
								</svg>
							</div>
							<span className='text-xl font-semibold'>DeSpace</span>
						</div>
						<p className='text-sm text-gray-400 mb-4'>© 2023 DeSpace Inc.</p>
						<div className='space-y-2'>
							<a
								href='#'
								className='block text-sm text-gray-400 hover:text-gray-900'
							>
								Data Processing Agreement
							</a>
							<a
								href='#'
								className='block text-sm text-gray-400 hover:text-gray-900'
							>
								Privacy Policy
							</a>
							<a
								href='#'
								className='block text-sm text-gray-400 hover:text-gray-900'
							>
								Terms of Service
							</a>
						</div>
						<div className='flex space-x-4 mt-4'>
							<a href='#' className='text-gray-400 hover:text-gray-900'>
								<Linkedin className='w-5 h-5' />
							</a>
							<a href='#' className='text-gray-400 hover:text-gray-900'>
								<Facebook className='w-5 h-5' />
							</a>
							<a href='#' className='text-gray-400 hover:text-gray-900'>
								<Instagram className='w-5 h-5' />
							</a>
							<a href='#' className='text-gray-400 hover:text-gray-900'>
								<Twitter className='w-5 h-5' />
							</a>
						</div>
					</div>

					{/* Product Column */}
					<div>
						<h3 className='text-sm font-semibold text-gray-900 mb-4'>
							Product
						</h3>
						<ul className='space-y-3'>
							{[
								"Features",
								"Templates",
								"Pricing",
								"Integrations",
								"Privacy & security",
								"What's New",
							].map((item) => (
								<li key={item}>
									<a
										href='#'
										className='text-sm text-gray-400 hover:text-gray-900'
									>
										{item}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* DeSpace for Column */}
					<div>
						<h3 className='text-sm font-semibold text-gray-900 mb-4'>
							DeSpace for
						</h3>
						<ul className='space-y-3'>
							{[
								"Engineering teams",
								"People teams",
								"Managers",
								"Startups",
								"Virtual conferences",
								"Education",
							].map((item) => (
								<li key={item}>
									<a
										href='#'
										className='text-sm text-gray-400 hover:text-gray-900'
									>
										{item}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Remote work Column */}
					<div>
						<h3 className='text-sm font-semibold text-gray-900 mb-4'>
							Remote work
						</h3>
						<ul className='space-y-3'>
							{["Virtual office", "Team meetings", "Team socials"].map(
								(item) => (
									<li key={item}>
										<a
											href='#'
											className='text-sm text-gray-400 hover:text-gray-900'
										>
											{item}
										</a>
									</li>
								)
							)}
						</ul>
					</div>

					{/* Resources & Company Column */}
					<div>
						<div className='mb-8'>
							<h3 className='text-sm font-semibold text-gray-900 mb-4'>
								Resources
							</h3>
							<ul className='space-y-3'>
								{[
									"DeSpace Academy",
									"Customer stories",
									"Testimonials",
									"Blog",
								].map((item) => (
									<li key={item}>
										<a
											href='#'
											className='text-sm text-gray-400 hover:text-gray-900'
										>
											{item}
										</a>
									</li>
								))}
							</ul>
						</div>
					
					</div>
				</div>

				
			</div>
		</footer>
	);
}
