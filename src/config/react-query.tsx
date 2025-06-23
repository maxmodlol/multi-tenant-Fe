"use client";

import * as React from "react";
import { QueryClientProvider as Qcp, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { PropsWithChildren, ReactElement } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      refetchOnReconnect: true,
      refetchOnMount: "always",
    },
  },
});

function QueryClientProvider({ children, ...props }: Readonly<PropsWithChildren>): ReactElement {
  return (
    <Qcp client={queryClient} {...props}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" position="right" />
    </Qcp>
  );
}

export default QueryClientProvider;
