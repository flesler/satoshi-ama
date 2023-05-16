//Modules
import { useChat } from "@/store/chat"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

//Components
import { ChatMessage } from '@/components/Chat/ChatMessage'
import { NewChat } from '@/components/Chat/NewChat'
import { Input } from "@/components/Input"
import api from '@/services/api'
import { useApiKey } from "@/store/apiKey"
import { qas } from '@/store/qas'
import { useQuestions } from '@/store/questions'
import {
  IconButton,
  Select,
  Spinner,
  Stack,
  Text
} from "@chakra-ui/react"
import { FiSend } from "react-icons/fi"
import { Instructions } from "../Layout/Instructions"

export interface ChatProps { };

interface ChatSchema {
  input: string
};

interface Response {
  answer?: string
  error?: string
  hallucination?: boolean
}



export const Chat = ({ ...props }: ChatProps) => {
  const { apiKey, clearAPIKey } = useApiKey()
  const {
    selectedChat,
    addMessage,
    addChat,
  } = useChat()

  // const selectedId = selectedChat?.id,
  //   selectedRole = selectedChat?.role;

  const messageCount = selectedChat && selectedChat.content.length || 0
  const hasSelectedChat = messageCount > 0
  const hasReply = messageCount > 1;
  const [isLoading, setIsLoading] = useState(false)
  const { questions, loadQuestions, askedQuestion } = useQuestions()

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  const { register, setValue, getValues, handleSubmit } = useForm<ChatSchema>();

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
      if (apiKey) {
        setValue("input", "");
      }

      addMessage(selectedId, {
        emitter: "user",
        message: prompt
      });

      try {
        let data: Response
        const qa = qas.find(qa => qa.q === prompt)
        if (qa) {
          await delay(1000)
          // Some can be cached locally
          data = { answer: qa.a }
        } else {
          data = await api.post('/request', { apiKey, question: prompt })
        }
        if (data.error || !data.answer) {
          throw new Error(data.error || '?')
        }
        addMessage(selectedId, { emitter: "gpt", message: data.answer, hallucination: data.hallucination, isNew: true })

      } catch (err: any) {
        let message: string = err.message
        if (apiKey && message.includes('OpenAI Error:')) {
          clearAPIKey()
          if (message.includes('401')) {
            message += '\n\n⚠️ Likely the API Key is invalid or has been revoked'
          }
          if (message.includes('429')) {
            message += '\n\n⚠️ Likely the API Key is not paid one or has no quota'
          }
        }
        if (message.includes('NetworkError')) {
          message = 'The service is offline, please retry later'
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
            selectedChat!.content.map((msg) => (
              <ChatMessage key={msg.message} msg={msg} />
            ))
          ) : (
              <Instructions onClick={(text) => {
                setValue('input', text)
                handleAsk(getValues())
              }} />
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
          {hasReply && <NewChat justifyContent="center" />}
          {!hasReply && !apiKey && <Select
            placeholder="Select a question to ask..."
            variant="filled"
            isDisabled={isLoading}
            {...register('input')}
            autoFocus
            color="#bbb"
            onChange={(e) => {
              const input = e.target.value
              handleAsk({ input })
            }}
          >
            {questions.map(question =>
              <option key={question} value={question}>{question}</option>
            )}
            <option value="">Custom (requires an OpenAI API Key)</option>
          </Select>}
          {!hasReply && !!apiKey && <Input
            autoFocus={true}
            variant="filled"
            placeholder="Use ↑/↓ arrows to cycle through example questions (no API Key needed!)..."
            isDisabled={isLoading}
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
          />}
          <Text
            textAlign="center"
            fontSize="sm"
            opacity={.5}
          >
            This project is only a Proof of Concept. Answers sometimes make no sense or don't reflect the source information. Your feedback is greatly appreciated.
          </Text>
        </Stack>
      </Stack>
    </Stack>
  )
}

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}