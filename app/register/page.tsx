"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
    const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setError("");
		setSuccess("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("http://localhost:5000/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
                    name
				}),
			});

			const body = await response.json();

			if (!response.ok) {
				setError(body?.message ?? "Unable to register. Please try again.");
				return;
			}

			setSuccess("Account created. Redirecting to sign in...");
			router.push("/login");
		} catch {
			setError("Unable to register. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>Join to get started.</CardDescription>
				</CardHeader>

				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="John Doe"
								value={name}
								onChange={(event) => setName(event.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="At least 6 characters"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								minLength={6}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm password</Label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="Re-enter your password"
								value={confirmPassword}
								onChange={(event) => setConfirmPassword(event.target.value)}
								minLength={6}
								required
							/>
						</div>

						{error ? <p className="text-sm text-red-500">{error}</p> : null}
						{success ? <p className="text-sm text-green-600">{success}</p> : null}

						<p className="text-sm text-slate-600">
							Already have an account?{" "}
							<Link href="/login" className="font-medium text-slate-900 underline">
								Sign in
							</Link>
						</p>
					</CardContent>

					<CardFooter>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Creating account..." : "Create account"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</main>
	);
}
