//Modules
import { useModal } from "@/hooks/useModal"
import { useChat } from "@/store/chat"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { motion } from "framer-motion"
import { CSSProperties, useEffect, useState } from "react"
import store from "store2"

//Components
import { useApiKey } from '@/store/apiKey'
import {
  Button,
  Divider,
  Heading,
  IconButton,
  Spacer,
  Stack,
  Text,
  useColorMode
} from "@chakra-ui/react"
import {
  FiKey,
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiMoon,
  FiPlus,
  FiSun,
  FiTrash2, FiX
} from "react-icons/fi"
import {
  APIKeyModal as APIKeyModalContent
} from "../Layout/APIKeyModal"

export interface SideBarProps {
  isResponsive?: boolean
};

export const Sidebar = ({ isResponsive, ...props }: SideBarProps) => {
  const [isOpen, setIsOpen] = useState(true),
    handleOpen = () => setIsOpen(true),
    handleClose = () => setIsOpen(false);

  const [listRef] = useAutoAnimate();
  const { apiKey, clearAPIKey } = useApiKey()

  const { toggleColorMode, colorMode } = useColorMode()
  const {
    chat: chats,
    selectedChat,
    addChat,
    setSelectedChat,
    removeChat,
    clearAll,
    getTitle
  } = useChat();

  const {
    Modal: APIKeyModal,
    handleOpen: handleOpenAPIKeyModal,
    handleClose: handleCloseAPIKeyModal
  } = useModal();

  useEffect(() => {
    if (!isResponsive) handleClose()
  }, [isResponsive]);

  useEffect(() => {
    store.local("@chat", chats)
  }, [chats, selectedChat])

  const responsiveProps = isResponsive ? {
    position: "fixed" as CSSProperties['position'],
    left: isOpen ? 0 : '-100%',
    top: 0
  } : {};

  return (
    <>
      {!!(isResponsive) && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          padding={2}
        >
          <IconButton
            aria-label="menu"
            icon={<FiMenu />}
            onClick={handleOpen}
          />
          <Heading
            size="md"
          >{selectedChat && getTitle(selectedChat)}</Heading>
          <IconButton
            aria-label="add"
            icon={<FiPlus />}
            onClick={() => addChat()}
          />
        </Stack>
      )}
      {!!(isOpen) && (
        <Stack
          as={motion.div}
          width="full"
          height="full"
          position="absolute"
          top={0}
          left={0}
          backgroundColor="whiteAlpha.700"
          transition="all ease .5s"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
        />
      )}
      <Stack
        maxWidth={64}
        width="full"
        height="full"
        padding={2}
        color="white"
        backgroundColor="gray.900"
        zIndex={1}
        transition="all ease .5s"
        {...responsiveProps}
      >
        {!!(isResponsive) && (
          <IconButton
            aria-label="close button"
            icon={(<FiX />)}
            position="absolute"
            right={0}
            transform={'translateX(125%)'}
            colorScheme="red"
            backgroundColor="gray.800"
            color="white"
            onClick={handleClose}
          />
        )}
        <Button
          leftIcon={<FiPlus size={16} />}
          borderWidth={1}
          borderColor="whiteAlpha.400"
          rounded={4}
          padding={2}
          justifyContent="flex-start"
          transition="all ease .5s"
          backgroundColor="transparent"
          onClick={() => addChat()}
          _hover={{
            backgroundColor: "whiteAlpha.100"
          }}
        >New chat</Button>
        <Stack
          height="full"
          overflowY="auto"
          ref={listRef}
        >
          {chats?.map((chat) => {
            const { id } = chat
            const title = getTitle(chat)
            return (
              <Button
                id={id}
                key={id}
                cursor="pointer"
                leftIcon={<FiMessageSquare />}
                justifyContent="flex-start"
                padding={2}
                overflow="hidden"
                textOverflow="ellipsis"
                backgroundColor={
                  (selectedChat?.id == id) ? ("#ffffff20") : ("transparent")
                }
                onClick={() => setSelectedChat({ id })}
                _hover={{
                  backgroundColor: "whiteAlpha.100"
                }}
              >
                <Text title={title} isTruncated>{title}</Text>
                <Spacer />
                <FiTrash2
                  className="icon"
                  onClick={() => removeChat({ id })}
                  style={{
                    display: (selectedChat?.id == id) ? ("block") : ("none")
                  }}
                />
              </Button>
            )
          })}
        </Stack>
        <Divider
          marginY={2}
          borderColor="white"
        />
        <Stack>
          {!!chats?.length && <Button
            leftIcon={<FiTrash2 />}
            justifyContent="flex-start"
            padding={2}
            onClick={clearAll}
            backgroundColor="transparent"
            _hover={{
              backgroundColor: "blackAlpha.300"
            }}
          >Clear conversations</Button>}
          <Button
            justifyContent="flex-start"
            padding={2}
            onClick={toggleColorMode}
            backgroundColor="transparent"
            leftIcon={(colorMode == 'dark') ? <FiSun /> : <FiMoon />}
            _hover={{
              backgroundColor: "blackAlpha.300"
            }}
          >{(colorMode == 'dark') ? ('Light mode') : ('Dark mode')}</Button>
          {/* <Button
            leftIcon={<FiExternalLink />}
            justifyContent="flex-start"
            padding={2}
            backgroundColor="transparent"
            _hover={{
              backgroundColor: "blackAlpha.300"
            }}
          >Updates & FAQ</Button> */}
          {apiKey && <Button
            leftIcon={<FiLogOut />}
            justifyContent="flex-start"
            padding={2}
            backgroundColor="transparent"
            onClick={() => clearAPIKey()}
            _hover={{
              backgroundColor: "blackAlpha.300"
            }}
          >Log Out</Button>}
          <Button
            id="set-api-key"
            leftIcon={<FiKey />}
            padding={2}
            justifyContent="flex-start"
            backgroundColor="transparent"
            onClick={handleOpenAPIKeyModal}
            _hover={{
              backgroundColor: "blackAlpha.300"
            }}
          >Change API Key</Button>
        </Stack>
      </Stack>
      <APIKeyModal
        title="API Key"
      >
        <APIKeyModalContent
          onConfirm={handleCloseAPIKeyModal}
        />
      </APIKeyModal>
    </>
  )
}
