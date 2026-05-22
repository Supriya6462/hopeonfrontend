export function getErrorMessage(
  error: unknown,
  fallback = "An error occurred",
) {
  if (error instanceof Error) return error.message || fallback;

  const anyErr = error as
    | { response?: { data?: { message?: string } }; message?: string }
    | undefined;
  return anyErr?.response?.data?.message || anyErr?.message || fallback;
}

export default getErrorMessage;
