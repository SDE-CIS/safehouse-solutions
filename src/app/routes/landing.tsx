import {Banner} from '@/components/ui/banner';
import {FeaturesSection} from "@/components/ui/features-section.tsx";
import {Newsletter} from '@/components/ui/newsletter';
import {FaBarcode, FaEye, FaWarehouse} from "react-icons/fa";
import {useTranslation} from "react-i18next";

export function LandingRoute() {
    const {t} = useTranslation();

    const features = [
        {
            icon: <FaWarehouse/>,
            title: t('landing.inventory'),
            text: t('landing.inventory.description')
        },
        {
            icon: <FaEye/>,
            title: t('landing.monitoring'),
            text: t('landing.monitoring.description')
        },
        {
            icon: <FaBarcode/>,
            title: t('landing.barcode'),
            text: t('landing.barcode.description')
        },
    ];

    return (
        <div>
            <Banner
                imageUrl="/images/warehouses/1.jpg"
                title={t('landing.welcome')}
                description={t('landing.partner')}
                size='sm'
            />

            <FeaturesSection features={features}/>
            <Newsletter/>
        </div>
    );
}
