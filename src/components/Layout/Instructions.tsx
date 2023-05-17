import { useQuestions } from '@/store/questions'
import { Button, Heading, Icon, Stack, Text } from "@chakra-ui/react"
import { useEffect } from 'react'
import { IconType } from "react-icons"
import { FiAlertTriangle, FiSun, FiZap } from "react-icons/fi"

type Introduction = {
  icon: IconType,
  name: "Examples" | "Capabilities" | "Limitations",
  list: string[]
};

export interface IInstructionsProps {
  isResponsive?: boolean
  onClick: (text: string) => void
};

const introduction: Introduction[] = [
  {
    icon: FiSun,
    name: "Examples",
    list: []
  },
  {
    icon: FiZap,
    name: "Capabilities",
    list: [
      "Based off real responses by Satoshi Nakamoto",
      "Provides the Source of the original response",
      "Tries to detect cases of ChatGPT hallucinating",
    ]
  },
  {
    icon: FiAlertTriangle,
    name: "Limitations",
    list: [
      "No knowledge of world and events after December 2010",
      "ChatGPT frequently hallucinates responses not based on the data",
      "ChatGPT might hallucinate a Source that is real but doesn't justify the response",
    ]
  },
];

export const Instructions = ({ isResponsive, onClick }: IInstructionsProps) => {
  const { questions, loadQuestions } = useQuestions()

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  introduction[0].list = questions.slice(0, 3)
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      height="full"
      overflow="auto"
    >
      {!isResponsive && <Heading size="lg" marginY={8}>{document.title}</Heading>}
      <Stack
        direction={["column", "column", "row"]}
      >
        {introduction.map(({ icon, list, name }, key) => {
          const isExamples = name == 'Examples'
          if (isResponsive && !isExamples) {
            return
          }
          const handleClick = (text: string) => {
            if (isExamples) {
              return () => onClick(text)
            };
            return undefined
          };

          return (
            <Stack
              key={key}
              alignItems="center"
            >
              <Icon
                as={icon}
              />
              <Heading size="sm">{name}{isExamples ? ' (no API Key needed)' : ''}</Heading>
              {list.map((text, key) => (
                <Button
                  key={key}
                  maxWidth={64}
                  height="fit-content"
                  padding={4}
                  onClick={handleClick(text)}
                  cursor={isExamples ? 'pointer' : 'default'}
                >
                  <Text
                    overflow="hidden"
                    whiteSpace="normal"
                  >{text}</Text>
                </Button>
              ))}
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
};