// app/auth/signin/SignInForm.tsx
'use client'; // Mark this as a Client Component

import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { Button } from "~/components/ui/button"; // Shadcn Button
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card"; // Shadcn Card
import { Provider } from 'next-auth/providers';

interface SignInFormProps {
  providers: ({ id: string; name: string; type: "oidc" | "oauth"; } | null)[]; // Type for providers from getProviders()
}

const SignInForm: React.FC<SignInFormProps> = ({ providers }) => {
  const router = useRouter(); // Use useRouter from next/navigation

  async function handleSignIn(providerId: string) {
    await signIn(providerId, { callbackUrl: '/' }); // Redirect to home page after sign-in
  }

  return (
    <Card className="w-96">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Choose your preferred sign-in method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {providers && Object.values(providers).map((provider) => {
            if (provider == null) {
                return (<h1>Error with auth provider</h1>)
            } else {
                return (<Button
                    key={provider.name}
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSignIn(provider.id)}
                >
                    Sign in with {provider.name}
                </Button>)
            }
        })}
      </CardContent>
    </Card>
  );
};

export default SignInForm;