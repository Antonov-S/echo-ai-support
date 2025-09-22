"use client";

import { ArrowLeftIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai";
import { usePaginatedQuery } from "convex/react";

import { INITIAL_NUM_ITEMS } from "@/constants";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { WidgetFooter } from "@/modules/widget/ui/components/widget-footer";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { UseInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom
} from "@/modules/widget/atoms/widget-atoms";

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId
      ? {
          contactSessionId
        }
      : "skip",
    {
      initialNumItems: INITIAL_NUM_ITEMS
    }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    UseInfiniteScroll({
      status: conversations.status,
      loadMore: conversations.loadMore,
      loadSize: INITIAL_NUM_ITEMS
    });

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2">
          <Button
            variant="transparent"
            size="icon"
            onClick={() => setScreen("selection")}
          >
            <ArrowLeftIcon />
          </Button>
          <p>Inbox</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-2 p-4 overflow-y-auto">
        {conversations?.results.length > 0 &&
          conversations?.results.map(conversation => (
            <Button
              key={conversation._id}
              className="h-20 w-full justify-between"
              onClick={() => {
                setConversationId(conversation._id);
                setScreen("chat");
              }}
              variant="outline"
            >
              <div className="flex flex-col w-full gap-4 overflow-hidden text-start">
                <div className="flex w-full items-center justify-between gap-x-2">
                  <p className="text-muted-foreground text-xs">Chat</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(conversation._creationTime))}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between gap-x-2">
                  <p className="truncate text-sm">
                    {conversation.lastMessage?.text}
                  </p>
                  <ConversationStatusIcon
                    status={conversation.status}
                    className="shrink-0"
                  />
                </div>
              </div>
            </Button>
          ))}

        <InfiniteScrollTrigger
          canLoadMore={canLoadMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          ref={topElementRef}
        />
      </div>
      <WidgetFooter />
    </>
  );
};
