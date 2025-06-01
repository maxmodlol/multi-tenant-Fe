/* app/(auth)/login/page.tsx ----------------------------------- */
import QueryClientProvider from "@explore/config/react-query";
import LoginForm from "./LoginForm";

export const metadata = { title: "Login │ Dashboard" };

export default function LoginScreen() {
  return (
    <QueryClientProvider>
      <div className="flex flex-col items-center gap-6">
        {/* heading that sits ABOVE the card */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Log in to your account</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Please enter your details.</p>
        </div>

        {/* the form card */}
        <LoginForm />
      </div>
    </QueryClientProvider>
  );
}
