import { Box, Text, Image } from '@chakra-ui/react';
import {useTranslation} from "react-i18next";
import {Product} from "@/types/api.ts";

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
    const { t } = useTranslation();

    return (
        <Box
            position="relative"
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
            _hover={{ transform: 'scale(1.05)', transition: '0.3s ease-in-out' }}
            onClick={onClick}
        >
            {/* Product Image */}
            {product.Image ? (
                <Image
                    src={`data:image/png;base64,${product.Image}`}
                    alt={product.Name}
                    width="100%"
                    height="200px"
                    objectFit="cover"
                />
            ) : (
                <Box
                    height="200px"
                    bg="gray.200"
                    _dark={{ bg: 'gray.700' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text>{t('no_image')}</Text>
                </Box>
            )}

            {/* Hover Overlay */}
            <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                bg="rgba(0, 0, 0, 0.6)"
                color="white"
                opacity="0"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                transition="opacity 0.3s ease-in-out"
                _hover={{ opacity: 1 }}
            >
                <Text fontSize="xl" fontWeight="bold">
                    {product.Name}
                </Text>
                <Text mt={2}>{product.Description}</Text>
                <Text mt={2} fontWeight="bold">
                    DKK. {product.Price.toFixed(2)}
                </Text>
            </Box>
        </Box>
    );
}
