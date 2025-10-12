import { openai } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";

import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "Echo Agent",
  chat: openai.chat("gpt-4o-mini"),
  instructions: `You are a customer support agent. Use the "resolveConversation" tool when the user expresses finalization of the conversation. Use the "escalateConversation" tool when the user expresses frustration or explicitly requests a human.`
});
