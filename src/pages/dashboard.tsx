import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSsrAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("me")
      .then((response) => console.log(response))
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      <h1>Dashboard: {user?.email}</h1>
    </div>
  );
}

export const getServerSideProps = withSsrAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("me");

  console.log(response.data);
  return {
    props: {},
  };
});
