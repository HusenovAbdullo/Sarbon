import { DispatcherCargoPage } from "@/menu/dispatcher/cargo/page/DispatcherCargoPage";
import { parseCargoSearchParams } from "@/menu/dispatcher/cargo/model/searchParams";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function CargoRoutePage({ searchParams }: PageProps) {
  const params = parseCargoSearchParams(searchParams ?? {});
  return <DispatcherCargoPage params={params} />;
}
