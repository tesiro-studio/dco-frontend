import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useRouteError,
} from "react-router-dom";
import Lobby from "@/pages/Lobby";
import GameRoom from "@/pages/GameRoom";
import MainLayout from "@/layouts/MainLayout";

function ErrorBoundary() {
  const error = useRouteError();
  console.error("we caught an error on 404", error);
  return (
    <>
      The page you have requested does not seem to exist. Please come back and
      try again.
    </>
  );
}

// const Detail = React.lazy(async () => {
//   return import("./pages/Detail");
// });

const Root = (
  <Route errorElement={<ErrorBoundary />}>
    <Route element={<MainLayout />}>
      <Route path={''} element={<Lobby />} />
      <Route path={'/game'} element={<GameRoom />} />
    </Route>
  </Route>
);

const router = createBrowserRouter(createRoutesFromElements(Root));

const RoutesContainer = () => {
  return <RouterProvider router={router} />;
};

export default RoutesContainer;
