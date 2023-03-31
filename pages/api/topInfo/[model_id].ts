// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINT } from "config";

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
