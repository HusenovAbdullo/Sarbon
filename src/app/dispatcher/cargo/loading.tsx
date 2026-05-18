import { getDictionary } from "@/shared/config/i18n/server";
import { CargoLoadingState } from "@/modules/cargo/widgets/cargo-states/ui/CargoLoadingState";
import { AppShell } from "@/shared/ui/AppShell";

export default function Loading() {
  const dictionary = getDictionary("uz");
  return (
    <AppShell theme="light">
      <main className="app-page">
        <CargoLoadingState dictionary={dictionary} />
      </main>
    </AppShell>
  );
}
