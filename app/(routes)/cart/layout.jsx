import { RequireAuth } from "@/components/utils";

export default function ProtectedLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
