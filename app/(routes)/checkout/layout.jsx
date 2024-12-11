import { RequireAuth } from "@/components/utils";

<<<<<<< HEAD
export default function ProtectedLayout({ children }) {
=======
export default function Layout({ children }) {
>>>>>>> 254819ed0658f1ef838d987470239a86cd217959
  return <RequireAuth>{children}</RequireAuth>;
}
