import { Container } from "@chakra-ui/react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { ComponentType, Suspense, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { Layout } from "../../components/layout";
import { Loading } from "../../components/loading";
import NoSsrWrapper from "../../components/no-ssr-wrapper";
import { AppPageProvider, useAppPage, View } from "../../hooks/app-page";
import { UserDetailsProvider, useUserDetails } from "../../hooks/user";
import { getKeycloak } from "../../Keycloak";
import { isServer } from "../../utils";
import { LOG_SSO_EVENTS } from "../../utils/contants";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.log(error);
      const errMsg = (error as any).message ?? JSON.stringify(error);
      toast.error(`Something went wrong: ${errMsg}`);
    },
  }),
});

const AppIndexPage: NextPage = () => {
  if (isServer()) {
    return null;
  }

  return (
    <NoSsrWrapper>
      <div>
        <Toaster />
      </div>
      <QueryClientProvider client={queryClient}>
        <AuthenticatedApp>
          <UserDetailsProvider>
            <AppPageProvider>
              <AppWrapper />
            </AppPageProvider>
          </UserDetailsProvider>
        </AuthenticatedApp>
      </QueryClientProvider>
    </NoSsrWrapper>
  );
};
export default AppIndexPage;

const AuthenticatedApp: React.FC<any> = (props: any) => {
  const { authClient, initOptions } = getKeycloak();

  useEffect(() => {
    (window as any).enableKeycloakLogging = LOG_SSO_EVENTS;
  }, []);

  const eventLogger = (event: unknown, error: unknown) => {
    if ((window as any)?.enableKeycloakLogging) {
      console.log("onKeycloakEvent", event, error);
    }
  };

  const tokenLogger = (tokens: unknown) => {
    if ((window as any)?.enableKeycloakLogging) {
      console.log("onKeycloakTokens", tokens);
    }
  };

  return (
    <ReactKeycloakProvider
      authClient={authClient}
      LoadingComponent={<Loading />}
      onEvent={eventLogger}
      onTokens={tokenLogger}
      initOptions={initOptions}
    >
      {props.children}
    </ReactKeycloakProvider>
  );
};

const views: Record<View, ComponentType<{}>> = {
  home: dynamic(() => import("../../components/pages/home")),
  items: dynamic(() => import("../../components/pages/items")),
};

const AppWrapper: React.FC = () => {
  const userDetails = useUserDetails();
  const { view } = useAppPage();

  const AppPage = views[view];

  return (
    <Layout>
      <Container display="flex">
        {/* <div>userDetails: {JSON.stringify(userDetails)}</div> */}
        <Suspense fallback={<Loading />}>
          <AppPage />
        </Suspense>
      </Container>
    </Layout>
  );
};
