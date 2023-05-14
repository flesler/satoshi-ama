//Modules
import { PropsWithChildren } from "react";

//Components
import { query } from "@/services/query"
import { theme } from "@/styles/theme"
import { ChakraProvider } from "@chakra-ui/react"
import { QueryClientProvider } from "react-query";

export interface IProvidersProps extends PropsWithChildren { };

export const Providers = ({ children, ...props }: IProvidersProps) => {
  return (
    <QueryClientProvider client={query}>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  )
};