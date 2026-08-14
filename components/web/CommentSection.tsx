"use client";

import z from "zod";
import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { commentSchema } from "@/app/schemas/comment";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";

import { Button } from "../ui/button";
import { useParams } from "next/dist/client/components/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useTransition } from "react";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "../ui/separator";

function CommentSection(props: {
	preloadedComments: Preloaded<typeof api.comments.getCommentsById>;
}) {
	const [isPending, startTransition] = useTransition();
	const params = useParams<{ postId: Id<"posts"> }>();
	const data = usePreloadedQuery(props.preloadedComments);
	const createComment = useMutation(api.comments.createComment);
	const form = useForm({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			body: "",
			postId: params.postId,
		},
	});

	async function onSubmit(data: z.infer<typeof commentSchema>) {
		startTransition(async () => {
			try {
				await createComment(data);
				toast.success("Comment created successfully!");
				form.reset();
			} catch {
				toast.error("Failed to create comment. Please try again.");
			}
		});
	}
	if (data === undefined) {
		return <p>Loading comments...</p>;
	}

	return (
		<Card>
			<CardHeader className='flex flex-row items-center gap-2 border-bottom'>
				<MessageSquare className='size-5' />
				<h2 className='text-xl font-bold'>{data.length} comments</h2>
			</CardHeader>
			<CardContent>
				<form
					className='space-y-4'
					onSubmit={form.handleSubmit(onSubmit)}>
					<Controller
						name='body'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>Write a comment</FieldLabel>
								<Textarea
									className='w-full h-20  '
									aria-invalid={fieldState.invalid}
									placeholder='Share your thoughts...'
									{...field}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Button
						disabled={isPending}
						className='mb-4'>
						{isPending ? (
							<>
								{" "}
								<Loader2 className='size-4 animate-spin' />
								<span>Loading...</span>
							</>
						) : (
							"Submit"
						)}
					</Button>
				</form>

				<Separator />
				<section className='my-4 space-y-4'>
					{data?.map((comment) => (
						<div
							key={comment._id}
							className='flex space-x-4'>
							<Avatar className='size-10 shrink-0'>
								<AvatarImage
									src={`https://avatar.vercel.sh/${comment._id}`}
								/>
								<AvatarFallback>
									{comment._id.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className='flex flex-col w-full'>
								<div className='flex items-center justify-between w-full'>
									<p className='font-semibold text-sm'>
										{comment.authorName}
									</p>
									<p className='text-xs text-muted-foreground'>
										{new Date(
											comment._creationTime,
										).toLocaleDateString()}
									</p>
								</div>
								<p className='text-sm text-muted-foreground'>
									{comment.body}
								</p>
							</div>
						</div>
					))}
				</section>
			</CardContent>
		</Card>
	);
}

export default CommentSection;
