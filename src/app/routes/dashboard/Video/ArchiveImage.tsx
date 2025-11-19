import { Box } from "@chakra-ui/react";
import { FaVideo } from "react-icons/fa6";
import { useThumbnailQuery } from "@/services/api";

export function ArchiveImage(props: { name: string }) {
    const fileName = props.name.replace(/\.[^/.]+$/, "");
    const { data: thumbnail } = useThumbnailQuery(`${fileName}.jpg`);

    console.log(thumbnail);

    return (
        <Box position="relative" width="100%" height="100%" overflow="hidden">
            {thumbnail ? (
                <img
                    src={`data:image/jpeg;base64,${thumbnail}`}
                    alt={props.name}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                />
            ) : (
                <FaVideo
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "3rem",
                        color: "#3182CE",
                        opacity: 0.8,
                    }}
                />
            )}
        </Box>
    );
}
