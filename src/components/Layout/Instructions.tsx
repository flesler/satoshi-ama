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
      "Provides the Date of the original response",
      "Provides the Source of the original response",
    ]
  },
  {
    icon: FiAlertTriangle,
    name: "Limitations",
    list: [
      "ChatGPT frequently hallucinates responses not based on the data",
      "ChatGPT might provide a Source that is real but doesn't justify the response",
      "Limited knowledge of world and events after 2010"
    ]
  }
];

export const Instructions = ({ onClick }: IInstructionsProps) => {
  const { questions, loadQuestions } = useQuestions()

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  introduction[0].list = questions//.slice(0, 3)
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      height="full"
      overflow="auto"
    >
      <Heading
        size="lg"
        marginY={8}
      >Satoshi Nakamoto AMA</Heading>
      <Stack
        direction={["column", "column", "row"]}
      >
        {introduction.map(({ icon, list, name }, key) => {
          const isExamples = name == 'Examples'
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
              overflow={isExamples ? 'scroll' : undefined}
              maxHeight={isExamples ? '310px' : undefined}
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