//Modules
import gptAvatar from "@/assets/satoshi.png"
import user from "@/assets/user.png"
import warning from "@/assets/warning.svg"
import { useChat } from "@/store/chat"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

//Components
import { Input } from "@/components/Input"
import api from '@/services/api'
import { useApiKey } from "@/store/apiKey"
import { useQuestions } from '@/store/questions'
import {
  Avatar,
  IconButton,
  Spinner,
  Stack,
  Text
} from "@chakra-ui/react"
import { FiSend } from "react-icons/fi"
import ReactMarkdown from 'react-markdown'
import { Instructions } from "../Layout/Instructions"

export interface ChatProps { };

interface ChatSchema {
  input: string
};

const HALLUCIONATION_WARNING = `⚠️ This response is very likely an hallucination of ChatGPT. It\'s not based on the provided sources. The "Source" link is likely real but might not actually include the response above.`
const LINK = /(http[^),\n! ]+)/g

export const Chat = ({ ...props }: ChatProps) => {
  const { apiKey, clearAPIKey } = useApiKey()
  const {
    selectedChat,
    addMessage,
    addChat,
  } = useChat()

  // const selectedId = selectedChat?.id,
  //   selectedRole = selectedChat?.role;

  const hasSelectedChat = selectedChat && selectedChat?.content.length > 0;
  const [isLoading, setIsLoading] = useState(false)
  const { questions, loadQuestions, askedQuestion } = useQuestions()

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  const {
    register,
    setValue,
    handleSubmit
  } = useForm<ChatSchema>();

  const overflowRef = useRef<HTMLDivElement>(null)
  const updateScroll = () => {
    overflowRef.current?.scrollTo(0, overflowRef.current.scrollHeight)
  };

  const [parentRef] = useAutoAnimate();

  const handleAsk = async ({ input: prompt }: ChatSchema) => {
    if (!apiKey && !questions.includes(prompt)) {
      // If no API key is set and the question is non-standard, they need to provide an API key first
      document.getElementById('set-api-key')?.click()
      return
    }
    updateScroll()
    const sendRequest = async (selectedId: string) => {
      askedQuestion(prompt)
      setIsLoading(true)
      setValue("input", "");

      addMessage(selectedId, {
        emitter: "user",
        message: prompt
      });

      try {
        const data = await api.post('/request', { apiKey, question: prompt })
        const answer: string = data.answer
        if (data.error || !answer) {
          throw new Error(data.error || '?')
        }
        addMessage(selectedId, { emitter: "gpt", message: answer, hallucination: data.hallucination })

      } catch (err: any) {
        let message = err.message
        if (apiKey && message === 'Request failed with status code 401') {
          clearAPIKey()
          message += ' (Likely the API Key is invalid or has no quota)'
        }
        addMessage(selectedId, { emitter: "error", message })
      }
      updateScroll()
      setIsLoading(false)
    };

    // Always start a new chat
    // if (selectedId) {
    //   if (prompt && !isLoading) {
    //     sendRequest(selectedId)
    //   };
    // } else {
    addChat(sendRequest)
    // };
  };

  const cycle = (prompt: string, direction: number) => {
    let index = questions.indexOf(prompt)
    if (index === -1) {
      index = 0
    } else {
      index = (index + direction + questions.length) % questions.length
    }
    setValue("input", questions[index])
  }

  return (
    <Stack
      width="full"
      height="full"
    >
      <Stack
        maxWidth="768px"
        width="full"
        marginX="auto"
        height="85%"
        overflow="auto"
        ref={overflowRef}
      >
        <Stack
          spacing={2}
          padding={2}
          ref={parentRef}
          height="full"
        >
          {(hasSelectedChat) ? (
            selectedChat.content.map(({ emitter, message, hallucination }, key) => {
              const getAvatar = () => {
                switch (emitter) {
                  case "gpt":
                    return gptAvatar
                  case "error":
                    return warning
                  default:
                    return user
                }
              };

              const getMessage = () => {
                return message.trim().replace(LINK, '[$1]($1)')
              };

              return (
                <Stack
                  key={key}
                  direction="row"
                  padding={4}
                  rounded={8}
                  backgroundColor={
                    (emitter == 'gpt') ? ("blackAlpha.200") : ("transparent")
                  }
                  spacing={4}
                >
                  <Avatar
                    name={emitter}
                    src={getAvatar()}
                  />
                  <Text
                    whiteSpace="pre-wrap"
                    marginTop=".75em !important"
                    overflow="hidden"
                  >
                    <ReactMarkdown >
                      {getMessage()}
                    </ReactMarkdown>
                    {hallucination && <>
                      <br /><br />
                      <p style={{ color: 'red', fontSize: '14px', fontStyle: 'italic' }}>{HALLUCIONATION_WARNING}</p>
                    </>}
                  </Text>
                </Stack>
              )
            })
          ) : (
            <Instructions
              onClick={(text) => setValue('input', text)}
            />
          )}
        </Stack>
      </Stack>
      <Stack
        height="20%"
        padding={4}
        backgroundColor="blackAlpha.400"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
      >
        <Stack
          maxWidth="768px"
        >
          {/* TODO: Show a dropdown with questions if no apiKey */}
          <Input
            autoFocus={true}
            variant="filled"
            inputRightAddon={(
              <IconButton
                aria-label="send_button"
                icon={(!isLoading) ? (<FiSend />) : (<Spinner />)}
                backgroundColor="transparent"
                onClick={handleSubmit(handleAsk)}
              />
            )}
            {...register('input')}
            onSubmit={console.log}
            onKeyDown={(e) => {
              const input = e.currentTarget.value
              switch (e.key) {
                case 'Enter': return handleAsk({ input })
                case 'ArrowUp': return cycle(input, -1)
                case 'ArrowDown': return cycle(input, +1)
              }
            }}
          />
          <Text
            textAlign="center"
            fontSize="sm"
            opacity={.5}
          >Free Research Preview. Our goal is to make AI systems more natural and safe to interact with. Your feedback will help us improve.</Text>
        </Stack>
      </Stack>
    </Stack>
  )
}
