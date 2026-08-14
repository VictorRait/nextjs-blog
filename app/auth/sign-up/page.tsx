"use client";

import { signUpSchema, type SignUpFormValues } from "@/app/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import z from "zod";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SignUpPage() {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			name: "",
			password: "",
		},
	});

	function onSubmit(data: SignUpFormValues) {
		startTransition(async () => {
			await authClient.signUp.email({
				email: data.email,
				name: data.name,
				password: data.password,
				fetchOptions: {
					onSuccess: () => {
						toast.success("Logged in successfully");
						router.push("/");
					},
					onError: (error) => {
						toast.error(error.error.message);
					},
				},
			});
		});
	}
	return (
		<Card className='py-5'>
			<CardHeader>
				<CardTitle>Sign up</CardTitle>
				<CardDescription>Create an account to get started</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup className='gap-y-4'>
						<Controller
							name='name'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>FullName</FieldLabel>
									<Input
										aria-invalid={fieldState.invalid}
										placeholder='John Doe'
										{...field}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name='email'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Email</FieldLabel>
									<Input
										aria-invalid={fieldState.invalid}
										placeholder='johndoe@email.com'
										type='email'
										{...field}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name='password'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Password</FieldLabel>
									<Input
										aria-invalid={fieldState.invalid}
										placeholder='****'
										type='password'
										{...field}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Button disabled={isPending}>
							{isPending ? (
								<>
									{" "}
									<Loader2 className='size-4 animate-spin' />
									<span>Loading...</span>
								</>
							) : (
								"Signup"
							)}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}

export default SignUpPage;
