import { RequireAuth } from "@/components/utils";

export default function Layout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
