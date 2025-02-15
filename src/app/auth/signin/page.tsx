// app/auth/signin/page.tsx
import { api } from "~/trpc/server"

import SignInForm from './SignInForm'; // Create this Client Component in the next step

export default async function SignInPage() {
    const providers = await api.user.getProviders();

  if (!providers) {
    return <div>Error loading providers...</div>; // Handle case if providers are not fetched
  }

  console.log(providers)
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <SignInForm providers={providers} />
    </div>
  );
}