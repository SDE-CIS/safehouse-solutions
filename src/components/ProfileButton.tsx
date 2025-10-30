"use client"

import {
    Box,
    Center,
    Image,
    Input,
    Stack,
    Text,
    Button,
    Field,
    Portal,
    Dialog,
} from "@chakra-ui/react"
import { FiCamera } from "react-icons/fi"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { loggedOut, selectUsername } from "@/services/login"
import { useTranslation } from "react-i18next"
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from "@chakra-ui/react"
import { Avatar } from "@/components/ui/avatar"
import { toaster } from "@/components/ui/toaster"
import { useUpdateUserAvatarMutation } from "@/services/api"
import { Cookies } from "react-cookie"

const cookies = new Cookies();

export const ProfileButton = () => {
    const username = useAppSelector(selectUsername)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [uploadAvatar] = useUpdateUserAvatarMutation()
    const [file, setFile] = useState<File | null>(null)
    const [url, setUrl] = useState("")
    const [preview, setPreview] = useState<string | null>(null)
    const avatar = cookies.get("avatar") || "https://avatars.dicebear.com/api/male/username.svg";

    const onLogout = () => {
        dispatch(loggedOut())
        navigate("/")
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (selected) {
            setFile(selected)
            setUrl("")
            setPreview(URL.createObjectURL(selected))
        }
    }

    const handleUpload = async (onClose: () => void) => {
        try {
            if (!file && !url) return
            const userId = cookies.get("id")
            const payload = file ? { id: userId, file } : { id: userId, url }
            const res = await uploadAvatar(payload).unwrap()

            toaster.create({
                description: res.message || "Profile picture updated successfully",
                type: "info",
            })

            onClose()
            setFile(null)
            setUrl("")
            setPreview(null)
        } catch (err) {
            toaster.create({
                description:
                    (err as any)?.data?.message ?? "Failed to upload profile picture",
                type: "error",
            })
        }
    }

    return (
        <Dialog.Root>
            <MenuRoot>
                <MenuTrigger asChild>
                    <Box display="flex" alignItems="center" gap={2} cursor="pointer">
                        <Avatar
                            size="sm"
                            src={avatar}
                            transition="all 0.3s ease"
                        />
                        <Text mb={1} fontSize="md" cursor="pointer">
                            {username}
                        </Text>
                    </Box>
                </MenuTrigger>

                <MenuContent
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: "84%",
                        zIndex: 1000,
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        borderRadius: "8px",
                        padding: "16px",
                        minWidth: "200px",
                    }}
                >
                    <Center mb={4}>
                        <Dialog.Trigger asChild>
                            <div style={{ position: "relative", cursor: "pointer" }}>
                                <Avatar
                                    size="2xl"
                                    src={avatar}
                                    style={{ transition: "all 0.3s ease" }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        backgroundColor: "rgba(0,0,0,0.6)",
                                        opacity: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "9999px",
                                        transition: "opacity 0.25s ease",
                                    }}
                                    className="avatar-hover-overlay"
                                >
                                    <FiCamera color="white" size={20} />
                                </div>
                            </div>
                        </Dialog.Trigger>
                    </Center>
                    <Center mb={4}>
                        <p>{username}</p>
                    </Center>

                    <MenuItem value="dashboard" style={{ padding: 0 }}>
                        <Link
                            to="/dashboard"
                            style={{
                                display: "block",
                                width: "100%",
                                height: "100%",
                                padding: "8px 16px",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            {t("navigation.app")}
                        </Link>
                    </MenuItem>

                    <MenuItem value="users" style={{ padding: 0 }}>
                        <Link
                            to="/dashboard/users"
                            style={{
                                display: "block",
                                width: "100%",
                                height: "100%",
                                padding: "8px 16px",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            {t("navigation.users")}
                        </Link>
                    </MenuItem>

                    <MenuItem
                        value="log-out"
                        style={{ color: "red.500", padding: 0 }}
                        onClick={onLogout}
                    >
                        <Text
                            style={{
                                display: "block",
                                width: "100%",
                                height: "100%",
                                padding: "8px 16px",
                                textDecoration: "none",
                                color: "red",
                                cursor: "pointer",
                            }}
                        >
                            {t("navigation.log_out")}
                        </Text>
                    </MenuItem>
                </MenuContent>
            </MenuRoot>

            {/* 🧱 Chakra UI v3 Dialog Anatomy */}
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Change Profile Picture</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body pb="4">
                            <Stack gap="4">
                                <Field.Root>
                                    <Field.Label>Upload Image</Field.Label>
                                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                                </Field.Root>

                                <Text textAlign="center">or paste an image URL:</Text>

                                <Field.Root>
                                    <Field.Label>Image URL</Field.Label>
                                    <Input
                                        placeholder="https://example.com/avatar.jpg"
                                        value={url}
                                        onChange={(e) => {
                                            setUrl(e.target.value)
                                            setFile(null)
                                            setPreview(e.target.value)
                                        }}
                                    />
                                </Field.Root>

                                {preview && (
                                    <Center>
                                        <Image
                                            src={preview}
                                            alt="Preview"
                                            borderRadius="md"
                                            maxW="150px"
                                            maxH="150px"
                                        />
                                    </Center>
                                )}
                            </Stack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                onClick={() => handleUpload(() => { })}
                                disabled={!file && !url}
                            >
                                Upload
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
