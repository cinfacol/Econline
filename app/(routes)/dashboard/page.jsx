import RetrieveUser from "@/components/auth/RetrieveUser";
import getAuthCookie from "@/lib/cookies";

const DashboardPage = async () => {
  const auth = await getAuthCookie();

  return <RetrieveUser token={auth} />;
};

export default DashboardPage;
