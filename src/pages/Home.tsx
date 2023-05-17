//Components
import { Chat } from "@/components/Chat"
import { Release } from '@/components/Chat/Release'
import { Sidebar } from "@/components/Sidebar"
import { useOnline } from '@/store/online'
import { Stack, useMediaQuery } from "@chakra-ui/react"
import { useEffect } from 'react'

export default function Home() {
  const [isResponsive] = useMediaQuery('(max-width: 800px)')
  const { checkOnline } = useOnline()

  useEffect(() => {
    checkOnline()
  }, [])

  return (
    <Stack
      direction={!isResponsive ? "row" : "column"}
      width="full"
      height="full"
      spacing={0}
    >
      <Sidebar
        isResponsive={isResponsive}
      />
      <Chat isResponsive={isResponsive} />
      <Release />
    </Stack>
  )
};