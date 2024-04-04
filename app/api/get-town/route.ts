import type { NextApiRequest, NextApiResponse } from "next";
import { GroupData } from "../../../functions/group-data";

export async function GET(request: NextApiRequest) {
  const { searchParams } = new URL(request.url as string);
  const townName = searchParams.get("townName");
  const townNameRegex = new RegExp(`^${townName}.*`, "i");
  console.log(townName?.toLowerCase());

  const isMatch = GroupData().filter((group) =>
    townNameRegex.test(group.location.toLowerCase())
  );

  if (isMatch.length === 0) {
    return new Response(JSON.stringify({ error: "Town not found" }), {
      status: 404,
    });
  } else {
    return new Response(JSON.stringify(isMatch), { status: 200 });
  }
}
