type SkeletonProps = {
	className?: string;
};

export default function Skeleton({ className = '' }: SkeletonProps) {
	return (
		<div
			aria-hidden="true"
			className={`skeleton-shimmer block ${className}`}
		/>
	);
}
