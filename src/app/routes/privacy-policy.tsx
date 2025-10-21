import { Container, Heading, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from "react-i18next";
import { Banner } from '@/components/ui/banner';

export function PrivacyPolicyRoute(): JSX.Element {
    const { t } = useTranslation();

    return (
        <>
            <Banner
                imageUrl="/images/privacy-policy.jpg"
                title={t('privacy_policy.title')}
                description={t('privacy_policy.description')}
                size='sm'
                overlayColor="rgba(0, 0, 0, 0.3)"
            />

            <Container maxW="container.xl" flex="1" py={10}>
                <Stack gap={8} align="center">
                    <Heading as="h1" size="xl" textAlign="center">
                        {t('privacy_policy.intro_title')}
                    </Heading>
                    <Text fontSize="md" maxW="3xl" textAlign="center">
                        {t('privacy_policy.intro_description')}
                    </Text>

                    <Text fontSize="md" maxW="3xl" textAlign="center">
                        {t('privacy_policy.detailed_content')}
                    </Text>

                    <Heading as="h2" size="lg" textAlign="center">
                        {t('privacy_policy.uses')}
                    </Heading>

                    <Text fontSize="md" maxW="3xl" textAlign="center">
                        {t('privacy_policy.uses_description')}
                    </Text>
                </Stack>
            </Container>
        </>
    );
}
