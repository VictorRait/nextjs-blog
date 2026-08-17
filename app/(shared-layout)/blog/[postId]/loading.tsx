import { Skeleton } from "@/components/ui/skeleton";

function loadingPage() {
	return (
		<div className='max-w-3xl mx-auto py-8 px-4'>
			<Skeleton className='h-10 w-24 mb-6' />
			<Skeleton className='w-full h-[400px] mb-8 rounded-xl' />
			<div>
				<Skeleton className='h-12 w-3/4'></Skeleton>
			</div>
		</div>
	);
}

export default loadingPage;
