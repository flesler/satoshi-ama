import { useChat } from '@/store/chat'
import { Button, ButtonProps } from "@chakra-ui/react"
import { FiPlus } from "react-icons/fi"

interface Props extends ButtonProps { }

export const NewChat = (props: Props) => {

  const { addChat } = useChat()
  return <Button
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
    {...props}
  >New chat</Button>
}