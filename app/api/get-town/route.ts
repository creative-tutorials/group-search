import type { NextApiRequest } from "next";
import { GroupData } from "../../../functions/group-data";

export async function GET(request: NextApiRequest) {
  const { searchParams } = new URL(request.url as string);
  const townName = searchParams.get("townName");
  const townNameRegex = new RegExp(`^${townName}.*`, "i"); // case-insensitive search

  const isMatch = GroupData().filter((group) =>
    townNameRegex.test(group.location.toLowerCase())
  );

  // check if there is a match
  if (isMatch.length === 0) {
    return new Response(JSON.stringify({ error: "Town not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(isMatch), { status: 200 });
}
