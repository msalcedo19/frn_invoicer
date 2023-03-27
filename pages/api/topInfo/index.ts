// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TGlobal>
) {
  if (req.method === "POST") {
    // Process a POST request
  } else {
    // Handle any other HTTP method
    const getData = async () => {
      const response = await fetch(`http://127.0.0.1:8000/topinfo/`, {
        method: "GET",
      });
      return response.json();
    };
    const data = await getData();
    res.status(200).json(data);
  }
}
