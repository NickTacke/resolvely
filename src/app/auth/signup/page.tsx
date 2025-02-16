// app/auth/signin/page.tsx
import SignUpForm from "./SignUpForm"; // Create this Client Component in the next step

export default async function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <SignUpForm />
    </div>
  );
}
