// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINT } from "config";
import { getHeadersAPI } from "@/pages/api/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const model_id = req.query.model_id;
  if (req.method == "GET") {
    // Handle any other HTTP method
    const getData = async () => {
      const url = new URL(`${API_ENDPOINT}/customer/${model_id}/invoices`);

      const response = await fetch(url.toString(), {
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
