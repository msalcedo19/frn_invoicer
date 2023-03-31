// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINT } from "config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
  } else {
    // Handle any other HTTP method
    const getData = async () => {
      const response = await fetch(`${API_ENDPOINT}/topinfo/`, {
        method: "GET",
      });
      return response.json();
    };
    const data = await getData();
    res.status(200).json(data);
  }
}
