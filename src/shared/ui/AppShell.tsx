import type { ThemeName } from "@/modules/cargo/entities/cargo/model/types";

export function AppShell({ children, theme }: { children: React.ReactNode; theme: ThemeName }) {
  return (
    <div className="theme-root" data-theme={theme}>
      {children}
    </div>
  );
}
