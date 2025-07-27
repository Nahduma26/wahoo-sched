import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let status: string | number | undefined;
  let statusText: string | undefined;
  let message: string | undefined;

  if (error && typeof error === "object") {
    if ("status" in error && error.status !== undefined) status = (error as any).status;
    if ("statusText" in error && error.statusText !== undefined) statusText = (error as any).statusText;
    if ("message" in error && error.message !== undefined) message = (error as any).message;
  }

  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      {status && <p>Status: <b>{status}</b></p>}
      <p>
        <i>{statusText || message || String(error)}</i>
      </p>
    </div>
  );
}

export default ErrorPage;