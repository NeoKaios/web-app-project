import { Navigate, useRouteError } from "react-router-dom";
import { ERROR_NOT_LOGGED_IN } from "../lib/consts";

export function APIErrorPage() {
  const error: any = useRouteError();

  console.warn("ERROR MSG: ", error.message);
  if (error.message === ERROR_NOT_LOGGED_IN) {
    return <Navigate to='/' />;
  }
  return <div>Its an error: {error.message}</div>;
}
