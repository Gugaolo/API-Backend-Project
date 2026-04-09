export function successResponse(data, message = 'OK', status = 200) {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function errorResponse(message, status = 500, details) {
  const body = {
    success: false,
    error: {
      message,
    },
  };

  if (details) {
    body.error.details = details;
  }

  return Response.json(body, { status });
}
