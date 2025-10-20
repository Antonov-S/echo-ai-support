import { openai } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";

import { SUPPORT_AGENT_PROMPT } from "../constants";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "Echo Agent",
  chat: openai.chat("gpt-4o-mini"),
  instructions: SUPPORT_AGENT_PROMPT
});
