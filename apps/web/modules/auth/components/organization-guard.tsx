"use client";

import { useOrganization } from "@clerk/nextjs";

import { AuthLayout } from "@/modules/auth/layouts/auth-layout";
import { OrgSelectView } from "@/modules/auth/views/org-select-view";

export const OrganizationGuard = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { organization } = useOrganization();

  if (!organization) {
    return (
      <AuthLayout>
        <OrgSelectView />
      </AuthLayout>
    );
  }

  return <>{children}</>;
};
