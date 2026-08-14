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
			<h1>Hello from index</h1>
			<Link href='/abc'>Go to Abc</Link>
		</div>
	);
}
