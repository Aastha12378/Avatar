import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (userId) {
    res.status(200).json({ message: `Logged in as ${userId}` });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
}
