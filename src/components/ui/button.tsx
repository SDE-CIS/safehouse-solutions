import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react"
import {
  AbsoluteCenter,
  Button as ChakraButton,
  Span,
  Spinner,
} from "@chakra-ui/react"
import * as React from "react"
import {useTranslation} from "react-i18next";

interface ButtonLoadingProps {
  loading?: boolean
  loadingText?: React.ReactNode
}

export interface ButtonProps extends ChakraButtonProps, ButtonLoadingProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(props, ref) {
        const { loading, disabled, loadingText, children, ...rest } = props;
        const { t } = useTranslation();

        // Helper to conditionally translate
        const getContent = (content: React.ReactNode) =>
            typeof content === "string" ? t(content) : content;

        return (
            <ChakraButton disabled={loading || disabled} ref={ref} {...rest}>
                {loading && !loadingText ? (
                    <>
                        <AbsoluteCenter display="inline-flex">
                            <Spinner size="inherit" color="inherit" />
                        </AbsoluteCenter>
                        <Span opacity={0}>{getContent(children)}</Span>
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
        );
    },
);
