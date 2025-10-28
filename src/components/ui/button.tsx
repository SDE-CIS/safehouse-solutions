import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react"
import {
    AbsoluteCenter,
    Button as ChakraButton,
    Spinner,
    Text as Span,
} from "@chakra-ui/react"
import * as React from "react"
import { useTranslation } from "react-i18next"

interface ButtonLoadingProps {
    loading?: boolean
    loadingText?: React.ReactNode
}

type ButtonVariant = "filled" | "reverse" | "outline" // ✅ Added

export interface ButtonProps extends ChakraButtonProps, ButtonLoadingProps {
    variantStyle?: ButtonVariant
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(props, ref) {
        const {
            loading,
            disabled,
            loadingText,
            children,
            variantStyle = "filled",
            ...rest
        } = props
        const { t } = useTranslation()

        const getContent = (content: React.ReactNode) =>
            typeof content === "string" ? t(content) : content

        // ✅ Style logic with "outline" variant included
        const baseStyles =
            variantStyle === "filled"
                ? {
                    bg: "brand.500",
                    color: "white",
                    border: "1px solid transparent",
                    _hover: {
                        bg: "transparent",
                        color: "black",
                        border: "1px solid black",
                    },
                }
                : variantStyle === "reverse"
                    ? {
                        bg: "transparent",
                        color: "black",
                        border: "1px solid black",
                        _dark: {
                            color: "white",
                            border: "1px solid white",
                        },
                        _hover: {
                            bg: "brand.500",
                            color: "white",
                            border: "1px solid transparent",
                        },
                    }
                    : {
                        // outline variant
                        bg: "transparent",
                        color: "brand.500",
                        border: "1px solid",
                        borderColor: "brand.500",
                        _hover: {
                            bg: "brand.500",
                            color: "white",
                        },
                        _dark: {
                            color: "brand.300",
                            borderColor: "brand.300",
                            _hover: {
                                bg: "brand.300",
                                color: "black",
                            },
                        },
                    }

        return (
            <ChakraButton
                ref={ref}
                disabled={loading || disabled}
                borderRadius="xl"
                transition="0.3s"
                {...baseStyles}
                {...rest}
            >
                {loading && !loadingText ? (
                    <>
                        <AbsoluteCenter display="inline-flex">
                            <Spinner size="inherit" color="inherit" />
                        </AbsoluteCenter>
                        <Span as="span" opacity={0}>
                            {getContent(children)}
                        </Span>
                    </>
                ) : loading && loadingText ? (
                    <>
                        <Spinner size="inherit" color="inherit" />
                        {getContent(loadingText)}
                    </>
                ) : (
                    getContent(children)
                )}
            </ChakraButton>
        )
    }
)
