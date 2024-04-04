import type { NextApiRequest, NextApiResponse } from "next";
import { GroupData } from "../../../functions/group-data";

export async function GET(request: NextApiRequest) {
  return new Response(JSON.stringify(GroupData()), { status: 200 });
}
