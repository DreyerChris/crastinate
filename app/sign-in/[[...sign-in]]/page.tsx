import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="w-full h-full flex items-center justify-center">
      <SignIn />
    </main>
  );
}
