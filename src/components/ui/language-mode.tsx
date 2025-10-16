import { createListCollection, Image, SelectContent, SelectItem, SelectRoot, SelectTrigger } from "@chakra-ui/react";
import { useState } from "react";
import i18n from "i18next";
import { languageChanged, selectCurrentLanguage } from "@/services/language.ts";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks";

export function LanguageModeButton() {
    const currentLanguage = useSelector(selectCurrentLanguage);
    const dispatch = useAppDispatch();

    const [language, setLanguage] = useState<string[]>([currentLanguage])

    function onChange(language: string[]) {
        i18n.changeLanguage(language[0]).then(() => {
            setLanguage(language);
            dispatch(languageChanged(language[0]));
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <SelectRoot collection={languages} size="sm" value={language} width="54px"
            onValueChange={(e) => onChange(e.value)}>
            <SelectTrigger>
                <Image
                    src={`/images/flags/${language[0]}.png`}
                    alt={`${language[0]} flag`}
                    h="25px"
                    w="auto"
                    mr={5}
                    cursor="pointer"
                />
            </SelectTrigger>
            <SelectContent position="absolute" mt={10}>
                {languages.items.map((language) => (
                    <SelectItem item={language} key={language.value}>
                        <Image
                            src={`/images/flags/${language.value}.png`}
                            alt={`${language.label} flag`}
                            h="25px"
                            w="auto"
                            mr={5}
                        />
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    )
}

const languages = createListCollection({
    items: [
        { label: "Danish", value: "dk" },
    ],
})
