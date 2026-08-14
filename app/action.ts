"use server";

import z from "zod";
import { postSchema } from "./schemas/blog";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { fetchAuthMutation } from "@/lib/auth-server";
import { updateTag } from "next/cache";

async function createBlogAction(values: z.infer<typeof postSchema>) {
	const parsed = postSchema.safeParse(values);

	if (!parsed.success) {
		throw new Error("something went wrong");
	}

	try {
		const imageUrl = await fetchAuthMutation(api.posts.generateImageUploadUrl, {});

		const uploadResult = await fetch(imageUrl, {
			method: "POST",
			headers: {
				"Content-Type": parsed.data.image?.type || "application/octet-stream",
			},
			body: parsed.data.image,
		});

		if (!uploadResult.ok) {
			throw new Error("Image upload failed");
		}

		const { storageId } = await uploadResult.json();

		await fetchAuthMutation(api.posts.createPost, {
			body: parsed.data.content,
			title: parsed.data.title,
			imageStorageId: storageId,
		});
	} catch (error) {
		return {
			error,
		};
	}
	updateTag("blog");
	return redirect("/blog");
}

export default createBlogAction;
