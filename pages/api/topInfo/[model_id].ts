// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINT } from "config";
import { getHeadersAPI } from "@/pages/api/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const model_id = req.query.model_id;
  if (req.method === "POST") {
    // Process a POST request
  } else if (req.method === "GET") {
    // Handle any other HTTP method
    res.status(200).json({});
  } else {
    const postData = async () => {
      const response = await fetch(`${API_ENDPOINT}/topinfo/${model_id}`, {
        method: "PATCH",
        headers: getHeadersAPI(req),
        body: JSON.stringify(req.body),
      });
      return { response: response.json(), status: response.status };
    };

    const data = await postData();
    const json = await data.response;
    const status_response = await data.status;
    res.status(status_response).json(json);
  }
}
