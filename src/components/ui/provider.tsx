"use client"

import { Provider as ReduxProvider } from "react-redux"
import { ChakraProvider } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { store } from "@/app/store"
import { theme } from "@/app/theme"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider value={theme}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </ReduxProvider >
  )
}
