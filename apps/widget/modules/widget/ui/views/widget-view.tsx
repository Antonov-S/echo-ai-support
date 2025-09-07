"use client";

import { useAtomValue } from "jotai";

import { screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { WidgetLoadingScreen } from "../screens/widget-loading-screen";
import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";
import { WidgetErrorScreen } from "@/modules/widget/ui/screens/widget-error-screen";

interface WidgetViewProps {
  organizationId: string | null;
}

export const WidgetView = ({ organizationId }: WidgetViewProps) => {
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    error: <WidgetErrorScreen />,
    auth: <WidgetAuthScreen />,
    voice: <p>TODO: Voice</p>,
    inbox: <p>TODO: Inbox</p>,
    selection: <p>TODO: Selection</p>,
    chat: <p>TODO: Chat</p>,
    contact: <p>TODO: Contact</p>
  };

  return (
    // TODO: Confirm whether or not min-h-screen and min-w-screen is needed
    <main className="min-h-screen min-w-screen flex flex-col h-full w-full overflow-hidden rounded-xl border bg-muted">
      {screenComponents[screen]}
    </main>
  );
};
