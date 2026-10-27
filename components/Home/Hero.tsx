import Image from 'next/image';
import ModalButton from '../UI/Login/Modal/ModalButton';

export default function Hero() {
	return (
		<section id="hero" className="w-full">
			<div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
				{/* App branding */}
				<div className="mb-12">
					<a
						href="/"
						className="inline-flex items-center gap-3 font-quicksand text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
					>
						<Image
							src="/budgetier.png"
							alt="Budgetier logo"
							width={100}
							height={100}
							priority
							className="h-30 w-30 object-contain sm:h-40 sm:w-40"
						/>

						<span>
							Budgetier
							<span className="text-primary">.</span>
						</span>
					</a>
				</div>
				{/* Hero content */}
				<div className="max-w-2xl">
					{/* Introductory label */}
					<p className="inline-flex items-center rounded-full bg-secondary-light px-3 py-1.5 text-xs font-semibold tracking-wide text-text-secondary">
						A FRESH APPROACH TO PERSONAL FINANCE
					</p>

					{/* Headline */}
					<h1 className="mt-6 font-quicksand text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
						Your finances.
						<br />
						Your pace.
						<br />
						<span className="text-primary-hover">Your rules.</span>
					</h1>

					{/* Description */}
					<p className="mt-6 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
						Keep track of what you earn, plan where your money goes,
						and make progress toward your goals—all in one place.
					</p>

					{/* Call to action */}
					<div className="mt-8">
						<ModalButton label="Get Started" variant="blush" />
					</div>
				</div>
			</div>
		</section>
	);
}
