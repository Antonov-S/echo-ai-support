"use client";

import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

interface WidgetViewProps {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: WidgetViewProps) => {
  return (
    // TODO: Confirm whether or not min-h-screen and min-w-screen is needed
    <main className="min-h-screen min-w-screen flex flex-col h-full w-full overflow-hidden rounded-xl border bg-muted">
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">How can we help you today?</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1">
        <h1>Widget View: {organizationId}</h1>
      </div>
      <WidgetFooter />
    </main>
  );
};
