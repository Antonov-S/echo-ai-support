import { toast } from "sonner";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";

import { api } from "@workspace/backend/_generated/api";

type Assistants = typeof api.private.vapi.getAssistants._returnType;
type PhoneNumbers = typeof api.private.vapi.getPhoneNumbers._returnType;

export const useVapiAssistants = (): {
  data: Assistants;
  isLoading: boolean;
  error: Error | null;
} => {
  const [data, setData] = useState<Assistants>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAssistants = useAction(api.private.vapi.getAssistants);

  useEffect(() => {
    let canceled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getAssistants();

        if (canceled) return;

        setData(result);
        setError(null);
      } catch (error) {
        if (canceled) return;

        setError(error as Error);
        toast.error("Failed to fetch assistants data");
      } finally {
        if (!canceled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      canceled = true;
    };
  }, []);

  return { data, isLoading, error };
};

export const useVapiPhoneNumbers = (): {
  data: PhoneNumbers;
  isLoading: boolean;
  error: Error | null;
} => {
  const [data, setData] = useState<PhoneNumbers>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumbers);

  useEffect(() => {
    let canceled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getPhoneNumbers();

        if (canceled) return;

        setData(result);
        setError(null);
      } catch (error) {
        if (canceled) return;

        setError(error as Error);
        toast.error("Failed to fetch phone numbers");
      } finally {
        if (!canceled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      canceled = true;
    };
  }, []);

  return { data, isLoading, error };
};
