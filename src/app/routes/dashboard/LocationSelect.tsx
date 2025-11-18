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
    // ✅ Select expects an array of selected keys (even single select)
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])

    // ✅ Create the list collection (v3 standard)
    const locationCollection = createListCollection<LocationItem>({
        items: [
            { label: `${t("location")} 1`, value: "1" },
            { label: `${t("location")} 2`, value: "2" },
            { label: `${t("location")} 3`, value: "3" },
        ],
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
