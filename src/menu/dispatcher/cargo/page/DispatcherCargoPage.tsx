import { filterCargoItems } from "@/modules/cargo/entities/cargo/lib/filterCargo";
import type { CargoPageParams } from "@/modules/cargo/entities/cargo/model/types";
import { getDictionary } from "@/shared/config/i18n/server";
import { AppShell } from "@/shared/ui/AppShell";
import { getCargoPage } from "../api/getCargoPage";
import { DispatcherCargoClientPage } from "./DispatcherCargoClientPage";

export async function DispatcherCargoPage({ params }: { params: CargoPageParams }) {
  const dictionary = getDictionary(params.lang);
  const result = await getCargoPage(params);
  const visibleItems = filterCargoItems(result.items, params);

  return (
    <AppShell theme={params.theme}>
      <DispatcherCargoClientPage
        params={params}
        dictionary={dictionary}
        items={visibleItems}
        total={result.total}
        totalPages={result.totalPages}
        error={result.error}
      />
    </AppShell>
  );
}
