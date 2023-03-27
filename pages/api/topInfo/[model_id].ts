// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

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
      const response = await fetch(`http://127.0.0.1:8000/topinfo/${model_id}`, {
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
