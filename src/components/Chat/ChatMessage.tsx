import { ChatContent } from '@/store/chat'
import { Avatar } from '@chakra-ui/avatar'
import { Stack } from '@chakra-ui/layout'
//Modules
import gptAvatar from "@/assets/satoshi.png"
import user from "@/assets/user.png"
import warning from "@/assets/warning.svg"

//Components
import {
  Text
} from "@chakra-ui/react"
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

export interface ChatMessageProps {
  msg: ChatContent
};


const HALLUCIONATION_WARNING = `⚠️ This response is very likely an hallucination of ChatGPT. It\'s not based on the provided sources. The "Source" link is likely real but might not actually include the response above.`

const LINK = /(https?:\/\/.+?\/[^),\n! ]+)/g

const getAvatar = (emitter: string) => {
  switch (emitter) {
    case "gpt":
      return gptAvatar
    case "error":
      return warning
    default:
      return user
  }
}

const addLink = (text: string) => {
  return text.replace(LINK, '[$1]($1)')
}

export const ChatMessage = ({ msg }: ChatMessageProps) => {
  const [message, setMessage] = useState(msg.isNew ? '' : msg.message)

  useEffect(() => {
    if (message === msg.message) {
      delete msg.isNew
      return
    }
    setTimeout(() => {
      const chars = Math.round(Math.random() * 1 + 2)
      setMessage(msg.message.slice(0, message.length + chars))
    }, 100)
  }, [msg, message])

  return <Stack
    direction="row"
    padding={4}
    rounded={8}
    backgroundColor={
      (msg.emitter == 'gpt') ? ("blackAlpha.200") : ("transparent")
    }
    spacing={4}
  >
    <Avatar
      // It gets into the text when copy pasting, annoying
      // name={msg.emitter}
      src={getAvatar(msg.emitter)}
    />
    <Text
      whiteSpace="pre-wrap"
      marginTop=".75em !important"
      overflow="hidden"
    >
      {msg.hallucination && <>
        <p style={{ color: 'red', fontSize: '14px', fontStyle: 'italic' }}>{HALLUCIONATION_WARNING}</p>
        <br />
      </>}
      <ReactMarkdown>
        {addLink(message)}
      </ReactMarkdown>
    </Text>
  </Stack>
}