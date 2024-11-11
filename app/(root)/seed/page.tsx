import { seed } from "@/lib/database/seed";

export default async function SEED() {
  await seed();
  return <div>page</div>;
}
