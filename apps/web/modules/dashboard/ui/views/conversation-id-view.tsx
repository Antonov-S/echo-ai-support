"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAction, useMutation, useQuery } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";

import { cn } from "@workspace/ui/lib/utils";
import { INITIAL_NUM_ITEMS } from "@/constants";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Form, FormField } from "@workspace/ui/components/form";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { UseInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { ConversationStatusButton } from "../components/conversation-status-button";
import {
  AIMessage,
  AIMessageContent
} from "@workspace/ui/components/ai/message";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools
} from "@workspace/ui/components/ai/input";

const formSchema = z.object({
  message: z.string().min(1, "Message is required")
});

interface ConversationIdViewProps {
  conversationId: Id<"conversations">;
}

export const ConversationIdView = ({
  conversationId
}: ConversationIdViewProps) => {
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId
  });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: INITIAL_NUM_ITEMS }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    UseInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: INITIAL_NUM_ITEMS
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ""
    }
  });

  const [isEnhanceing, setIsEnhanceing] = useState(false);
  const enhanceResponse = useAction(api.private.messages.enhanceResponse);
  const handleEnhanceResponse = async () => {
    setIsEnhanceing(true);
    const currentValue = form.getValues("message");

    try {
      const response = await enhanceResponse({ prompt: currentValue });

      form.setValue("message", response);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsEnhanceing(false);
    }
  };

  const createMessage = useMutation(api.private.messages.create);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessage({
        conversationId,
        prompt: values.message
      });

      form.reset();
    } catch (error) {
      console.error("error");
    }
  };

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const updateConversationStatus = useMutation(
    api.private.conversations.updateStatus
  );
  const handleToggleStatus = async () => {
    if (!conversation) return;

    setIsUpdatingStatus(true);
    let newStatus: "unresolved" | "escalated" | "resolved";

    // Cycle through states: unresolved -> escalated -> resolved -> unresolved

    if (conversation.status === "unresolved") {
      newStatus = "escalated";
    } else if (conversation.status === "escalated") {
      newStatus = "resolved";
    } else {
      newStatus = "unresolved";
    }

    try {
      await updateConversationStatus({
        conversationId,
        status: newStatus
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (conversation === undefined || messages.status === "LoadingFirstPage") {
    return <ConversationIdViewSkeleton />;
  }

  return (
    <div className="flex flex-col h-full bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
        {!!conversation && (
          <ConversationStatusButton
            onClick={handleToggleStatus}
            status={conversation.status}
            disabled={isUpdatingStatus}
          />
        )}
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {/* In reverse, because we are watching from "assistent" prespective */}
          {toUIMessages(messages.results ?? [])?.map(message => (
            <AIMessage
              from={message.role === "user" ? "assistant" : "user"}
              key={message.id}
            >
              <AIMessageContent>
                <AIResponse>{message.content}</AIResponse>
              </AIMessageContent>
              {message.role === "user" && (
                <DicebearAvatar
                  seed={conversation?.contactSessionId ?? "user"}
                  size={32}
                />
              )}
            </AIMessage>
          ))}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>

      <div className="p-2">
        <Form {...form}>
          <AIInput onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <AIInputTextarea
                  disabled={
                    conversation?.status === "resolved" ||
                    form.formState.isSubmitting ||
                    isEnhanceing
                  }
                  onChange={field.onChange}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  placeholder={
                    conversation?.status === "resolved"
                      ? "This conversation has been resolved"
                      : "Type your response as an operator..."
                  }
                  value={field.value}
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton
                  onClick={handleEnhanceResponse}
                  disabled={
                    conversation?.status === "resolved" ||
                    isEnhanceing ||
                    !form.formState.isValid
                  }
                >
                  <Wand2Icon />
                  {isEnhanceing ? "Enhancing..." : "Enhance"}
                </AIInputButton>
              </AIInputTools>
              <AIInputSubmit
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  isEnhanceing
                }
                status="ready"
                type="submit"
              />
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </div>
  );
};

export const ConversationIdViewSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          {Array.from({ length: 8 }, (_, index) => {
            const isUser = index % 2 === 0;
            const widths = ["w-48", "w-60", "w-72"];
            const width = widths[index % widths.length];

            return (
              <div
                className={cn(
                  "group flex w-full items-end justify-end gap-2 py-2 [&>div]:max-w-[80%]",
                  isUser ? "is-user" : "is-assistant flex-row-reverse"
                )}
                key={index}
              >
                <Skeleton
                  className={`h-9 ${width} rounded-lg bg-neutral-200`}
                />
                <Skeleton className="size-8 rounded-full bg-neutral-200" />
              </div>
            );
          })}
        </AIConversationContent>
      </AIConversation>

      <div className="p-2">
        <AIInput>
          <AIInputTextarea
            disabled
            placeholder="Type your response as an operator..."
          />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit disabled status="ready" />
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  );
};
