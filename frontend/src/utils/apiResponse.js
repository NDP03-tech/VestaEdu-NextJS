export function unwrapApiData(response) {
  if (
    response &&
    typeof response === "object" &&
    Object.prototype.hasOwnProperty.call(response, "data")
  ) {
    return response.data;
  }
  return response;
}

export function unwrapApiList(response) {
  const data = unwrapApiData(response);
  if (!Array.isArray(data)) {
    throw new TypeError("Expected API response data to be an array");
  }
  return data;
}
