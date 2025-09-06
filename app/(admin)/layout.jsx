import { RequireAdmin } from "@/components/utils";

export default function ProtectedLayout({ children }) {
  return <RequireAdmin>{children}</RequireAdmin>;
}
