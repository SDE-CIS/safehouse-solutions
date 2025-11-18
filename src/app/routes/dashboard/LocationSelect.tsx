import { useLocationsQuery } from "@/services/api"
import {
    createListCollection,
    Select,
    Field,
} from "@chakra-ui/react"
import { useState } from "react"

type LocationItem = {
    label: string
    value: string
}

export function LocationSelect({
    t,
    setLocationId,
}: {
    t: (key: string) => string
    setLocationId: (id: number) => void
}) {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const { data: locations } = useLocationsQuery();

    const locationCollection = createListCollection<LocationItem>({
        items: locations?.data.map((loc) => ({
            label: loc.LocationName,
            value: loc.ID.toString(),
        })) || [],
    })

    const handleValueChange = (details: { value: string[] }) => {
        setSelectedKeys(details.value)
        const firstValue = details.value[0]
        if (firstValue) setLocationId(Number(firstValue))
    }

    return (
        <Field.Root>
            <Field.Label>{t("assign_location")}</Field.Label>

            <Select.Root
                collection={locationCollection}
                value={selectedKeys}
                onValueChange={handleValueChange}
            >
                <Select.HiddenSelect />
                <Select.Label>{t("select_location")}</Select.Label>

                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder={t("select_location")} />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                        <Select.ClearTrigger />
                    </Select.IndicatorGroup>
                </Select.Control>

                <Select.Positioner>
                    <Select.Content>
                        {locationCollection.items.map((item) => (
                            <Select.Item key={item.value} item={item}>
                                {item.label}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Select.Root>
        </Field.Root>
    )
}
