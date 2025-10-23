import {
    Container,
    Heading,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export function OverviewRoute() {
    const { t } = useTranslation();

    // const {
    //     data: employees = [],
    //     error: employeesError,
    //     isLoading: isLoadingEmployees,
    // } = useEmployeesQuery(undefined, { pollingInterval: 10000 });

    // // Fetch packages
    // const {
    //     data: packages = [],
    //     error: packagesError,
    //     isLoading: isLoadingPackages,
    // } = usePackagesQuery(undefined, { pollingInterval: 10000 });

    return (
        <Container maxW="container.xl" py={8}>
            <Heading as="h1" size="xl" mb={6}>
                {t("dashboard.title")}
            </Heading>
        </Container>
    );
}
