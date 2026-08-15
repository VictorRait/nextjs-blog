"use client";

import { api } from "@/convex/_generated/api";
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";
import { Id } from "@/convex/_generated/dataModel";

interface roomProps {
	roomId: Id<"posts">;
	userId: string;
}

export function PostPresence({ roomId, userId }: roomProps) {
	const presenceState = usePresence(api.presence, roomId, userId);

	if (!presenceState || presenceState.length === 0) {
		return null;
	}

	return (
		<div className='flex items-center gap-2  text-black'>
			<p className='text-sm text-muted-foreground uppercase tracking-loose'>
				Viewing now
			</p>
			<FacePile presenceState={presenceState} />
		</div>
	);
}
