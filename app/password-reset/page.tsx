import type { Metadata } from "next";
import { AuthScreen } from "@/components/screens/auth-screen";

export const metadata: Metadata = {
  title: "Memetrest - Password Reset"
};

export default function PasswordResetRequestPage() {
  return <AuthScreen mode="password-reset-request" />;
}
