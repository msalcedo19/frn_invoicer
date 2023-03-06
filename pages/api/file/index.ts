// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
    console.log(req.body)
    const postData = async () => {
      const response = await fetch("http://127.0.0.1:8000/file", {
        method: "POST",
        body: req.body,
      });
      return response.json();
    };
    const data = await postData()
    res.status(200).json(data);
  } else {
    // Handle any other HTTP method
    res.status(200).json({asd: "asd"});
  }
}
