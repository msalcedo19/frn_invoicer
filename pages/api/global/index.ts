// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINT } from "config";
import { getHeadersAPI } from "@/pages/api/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TGlobal>
) {
  if (req.method === "POST") {
    // Process a POST request
  } else {
    // Handle any other HTTP method
    const getData = async () => {
      const response = await fetch(`${API_ENDPOINT}/global`, {
        method: "GET",
        headers: getHeadersAPI(req),
      });
      return { response: response.json(), status: response.status };
    };
    const data = await getData();
    const json = await data.response;
    const status_response = await data.status;
    res.status(status_response).json(json);
  }
}
