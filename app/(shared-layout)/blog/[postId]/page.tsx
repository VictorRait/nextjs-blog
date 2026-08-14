import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import CommentSection from "@/components/web/CommentSection";
import { PostPresence } from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

interface PostIdRouteProps {
	params: Promise<{ postId: Id<"posts"> }>;
}

export async function generateMetadata({ params }: PostIdRouteProps): Promise<Metadata> {
	const { postId } = await params;
	const post = await fetchQuery(api.posts.getPostById, { postId });

	if (!post) {
		return {
			title: "Post Not Found",
			description: "The requested post could not be found.",
		};
	}
	return {
		title: post.title,
		description: post.content,
	};
}

async function PostIdRoute({ params }: PostIdRouteProps) {
	return (
		<Suspense
			fallback={
				<>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-full' />
				</>
			}>
			{" "}
			<PostContent params={params} />
		</Suspense>
	);
}

async function PostContent({ params }: PostIdRouteProps) {
	const { postId } = await params;

	const token = await getToken();
	const [post, preloadComments, userId] = await Promise.all([
		await fetchQuery(api.posts.getPostById, { postId }),
		await preloadQuery(api.comments.getCommentsById, {
			postId: postId,
		}),
		await fetchQuery(api.presence.getUserId, {}, { token }),
	]);

	if (!post) {
		return (
			<h1 className='text-6xl font-extrabold text-red-500 py-20'>No post found</h1>
		);
	}

	return (
		<div className='max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative'>
			<Link
				className={buttonVariants({ variant: "outline" })}
				href='/blog'>
				<ArrowLeft className='size-4' /> Back to Blog
			</Link>

			<div className='relative w-full h-100 mt-4 mb-8 overflow-hidden rounded-lg shadow-sm'>
				<Image
					src={post.resolvedImageUrl ?? "/images/placeholder.png"}
					alt={post.title}
					fill
					className='object-cover hover:scale-105 transition-transform duration-500'
				/>
			</div>
			<div className='space-y-4 flex flex-col '>
				<h1 className='text-3xl font-bold mt-4 tracking-tight text-foreground'>
					{post.title ?? "Placeholder Title"}
				</h1>
				<p className='text-sm text-muted-foreground m-0'>
					Upload Date: {new Date(post._creationTime).toLocaleDateString()}
				</p>
				{userId && (
					<PostPresence
						roomId={postId}
						userId={userId}
					/>
				)}
				<Separator className='my-8' />
				<p className='text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap'>
					{post.content}
				</p>
				<Separator className='my-8' />

				<CommentSection preloadedComments={preloadComments} />
			</div>
		</div>
	);
}

export default PostIdRoute;
