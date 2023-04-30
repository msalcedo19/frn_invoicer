import type { NextApiRequest } from "next";

export const getHeadersAPI = (req: NextApiRequest) => {
  const requestHeaders: HeadersInit = new Headers();
  if (req.headers["content-type"])
    requestHeaders.set("Content-Type", req.headers["content-type"]);
  if (req.headers.authorization)
    requestHeaders.set("Authorization", req.headers.authorization);
  return requestHeaders;
};
