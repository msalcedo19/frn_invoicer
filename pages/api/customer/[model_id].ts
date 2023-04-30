// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINT } from "config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const model_id = req.query.model_id;
  if (req.method === "DELETE") {
    const getData = async () => {
      const response = await fetch(`${API_ENDPOINT}/customer/${model_id}`, {
        method: "DELETE",
        headers: {
          Authorization: req.headers.authorization,
        },
      });
      return { response: response.json(), status: response.status };
    };
    const data = await getData();
    const json = await data.response;
    const status_response = await data.status;
    res.status(status_response).json(json);
  } else if (req.method == "GET") {
    // Handle any other HTTP method
    const getData = async () => {
      const response = await fetch(`${API_ENDPOINT}/customer/${model_id}`, {
        method: "GET",
        headers: {
          Authorization: req.headers.authorization,
        },
      });
      return { response: response.json(), status: response.status };
    };
    const data = await getData();
    const json = await data.response;
    const status_response = await data.status;
    res.status(status_response).json(json);
  } else {
    const postData = async () => {
      const response = await fetch(`${API_ENDPOINT}/customer/${model_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": req.headers.authorization,
        },
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
