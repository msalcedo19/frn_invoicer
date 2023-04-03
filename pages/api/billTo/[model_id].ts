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
      const response = await fetch(`${API_ENDPOINT}/bill_to/${model_id}`, {
        method: "DELETE",
      });
      return response.json();
    };
    const data = await getData();
    res.status(200).json(data);
  } else if (req.method == "GET") {
    // Handle any other HTTP method
    const getData = async () => {
      const response = await fetch(`${API_ENDPOINT}/bill_to/${model_id}`, {
        method: "GET",
      });
      return response.json();
    };
    const data = await getData();
    res.status(200).json(data);
  } else {
    const postData = async () => {
      const response = await fetch(`${API_ENDPOINT}/bill_to/${model_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      return response.json();
    };
    const data = await postData();
    res.status(200).json(data);
  }
}
