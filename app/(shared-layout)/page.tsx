import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Home",
	description: "...",
};

export default function Home() {
	return (
		<div>
			<h1 className='text-4xl py-4'>A little test using Next.js</h1>

			<p className='pb-4'>
				Here I attempt a blog site using Next.js with Convex. Live presence. You
				can login and see other people viewing the page. Users are able to
				comment. Use johndoe@gmail.com, pass:12345678 to view the blog and create
				blogposts.
			</p>
			<Link href='/blog'>Go to Blog</Link>
		</div>
	);
}
