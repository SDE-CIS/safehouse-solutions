import { Banner } from '@/components/ui/banner';
import { Slideshow } from '@/components/ui/slideshow';
import { Container, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from "react-i18next";
import { FaDoorClosed, FaEye, FaHouse } from 'react-icons/fa6';

export function LandingRoute() {
    const { t } = useTranslation();

    const features = [
        {
            icon: <FaHouse />,
            title: t('landing.inventory'),
            text: t('landing.inventory.description')
        },
        {
            icon: <FaEye />,
            title: t('landing.monitoring'),
            text: t('landing.monitoring.description')
        },
        {
            icon: <FaDoorClosed />,
            title: t('landing.barcode'),
            text: t('landing.barcode.description')
        },
    ];

    return (
        <>
            <Banner
                imageUrl="/images/gradient4.jpg"
                title={t('landing.welcome')}
                description={t('landing.description')}
                extraText={t('landing.extra_text')}
                features={features}
                size='md'
                typing={true}
            />

            <Container maxW="container.xl" flex="1" py={10} textAlign="center">
                <Heading size="4xl" mb={4} textAlign="center">{t('landing.about_title')}</Heading>
                <Text fontSize="md" mb={4} textAlign="center">
                    {t('landing.about_description')}
                </Text>
                <Text fontSize="md" mb={4} textAlign="center">
                    {t('landing.about_description2')}
                </Text>
            </Container>

            <Banner
                imageUrl="/images/smart.jpeg"
                title={t('landing.get_started')}
                description={t('landing.get_started_description')}
                size='sm'
                overlayColor="rgba(0, 0, 0, 0.3)"
            />

            <Slideshow slides={[
                { title: t('project_smart_home'), description: t('project_smart_home_description'), src: "/images/slideshow/smart_home.jpeg", alt: t('project_smart_home') },
                { title: t('project_smart_office'), description: t('project_smart_office_description'), src: "/images/slideshow/office.jpeg", alt: t('project_smart_office') },
            ]} />
        </>
    );
}
