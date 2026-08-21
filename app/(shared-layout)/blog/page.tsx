import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Blog | Next.js 16 Tutorial",
	description:
		"Read our latest blog posts and insights on web development, Next.js, and more. Stay updated with our expert articles and tutorials.",
};

export default function BlogPage() {
	return (
		<div className='py-12'>
			<div className='text-center pb-12'>
				<h1 className='text-4xl font-semibold tracking-tight sm:text-5xl'>
					Our Blog
				</h1>
				<p className='pt-4 max-w-2xl mx-auto text-xl text-muted-foreground'>
					Insights, thoughts, and trends from our team.
				</p>
			</div>

			<Suspense fallback={<SkeletonLoading />}>
				{/* can comment out because it's cached */}
				<LoadBlogList />
			</Suspense>
		</div>
	);
}

async function LoadBlogList() {
	// "use cache";

	// cacheTag("blog");
	// cacheLife("hours");

	await connection();
	const data = await fetchQuery(api.posts.getPosts);
	return (
		<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
			{data?.map((post) => (
				<Card
					key={post._id}
					className='pt-0'>
					<div className='h-48 w-full overflow-hidden relative'>
						{" "}
						<Image
							src={
								post.resolvedImageUrl ??
								"https://images.unsplash.com/photo-1782730853521-16f5381b9534?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							}
							alt='blog_Image'
							className='object-cover w-full h-full'
							fill></Image>
					</div>

					<CardContent className='p-4'>
						<Link href={`/blog/${post._id}`}>
							<h1 className='text-2xl font-bold hover:text-primary'>
								{post.title}
							</h1>
							<p className='text-muted-foreground line-clamp-3'>
								{post.content}
							</p>
						</Link>
						<CardFooter className='bg-transparent border-none px-0'>
							<Link
								className={buttonVariants({
									className: "w-full",
								})}
								href={`blog/${post._id}`}>
								Read more
							</Link>
						</CardFooter>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

function SkeletonLoading() {
	return (
		<div className='grid gap-6 md:grid-cols-3 lg:grid-cols-3'>
			{[...Array(3)].map((_, i) => (
				<div
					className='flex flex-col space-y-3'
					key={i}>
					<Skeleton className='h-48 w-full rounded-xl' />
					<div className='space-y-2 flex flex-col'>
						<Skeleton className='h-6 w-3/4' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-full' />
					</div>
				</div>
			))}
		</div>
	);
}
