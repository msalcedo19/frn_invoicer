// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINT } from "config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<[TContract]>
) {
  if (req.method === "POST") {
    // Process a POST request
    const postData = async () => {
      const response = await fetch(`${API_ENDPOINT}/contract/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      return response.json();
    };
    const data = await postData()
    res.status(200).json(data);
  } else {
    // Handle any other HTTP method
    const getData = async () => {
      const response = await fetch(`${API_ENDPOINT}/contract/`, {
        method: "GET",
      });
      return response.json();
    };
    const data = await getData()
    res.status(200).json(data);
  }
}
