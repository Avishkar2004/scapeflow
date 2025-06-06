import { SetupUser } from "@/actions/billing/setupUser";
import { waitFor } from "@/lib/helper/waitFor";

export default async function SetUpPage() {
  await waitFor(4000);
  return await SetupUser();
}
