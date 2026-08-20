import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

function SearchInput() {
	const [searchTerm, setSearchTerm] = useState("");
	const [open, setOpen] = useState(false);

	const results = useQuery(
		api.posts.searchPost,
		searchTerm.length >= 2 ? { limit: 5, terms: searchTerm } : "skip",
	);

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchTerm(event.target.value);
		setOpen(event.target.value.length >= 2);
	}

	return (
		<div className='relative w-full max-w-sm z-10'>
			<div className='relative'>
				<Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
				<Input
					type='search'
					placeholder='Search posts...'
					value={searchTerm}
					onChange={handleInputChange}
					className='w-full rounded-md border border-input bg-transparent py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
				/>
			</div>
			{open && searchTerm.length >= 2 && (
				<div className='absolute top-full left-0 right-0 mt-2 bg-background border border-input rounded-md shadow-lg'>
					{results === undefined ? (
						<div className='p-4 text-sm text-muted-foreground'>
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							Searching...
						</div>
					) : results.length === 0 ? (
						<div className='p-4 text-sm text-muted-foreground'>
							No results found...
						</div>
					) : (
						<div className='py-2'>
							{results.map((post) => (
								<Link
									href={`/blog/${post._id}`}
									key={post._id}
									className='flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground
									'
									onClick={() => {
										setOpen(false);
										setSearchTerm("");
									}}>
									<p className='font-medium truncate'>{post.title}</p>
									<p className='text-xs text-muted-foreground truncate'>
										{post.body.substring(0, 60)}...
									</p>
								</Link>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default SearchInput;
