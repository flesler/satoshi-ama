import { useApiKey } from "@/store/apiKey"
import { Button, Stack, Text } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { FiKey } from "react-icons/fi"
import { Input } from "../Input"

type APIKeyScheme = {
  key: string
};

export interface APIKeyProps {
  onConfirm?: () => void
};

export const APIKeyModal = ({ onConfirm }: APIKeyProps) => {
  const { apiKey, setAPIKey } = useApiKey()
  const { register, handleSubmit, setError, formState: { errors } } = useForm<APIKeyScheme>();

  const handleChangeAPIKey = ({ key }: APIKeyScheme) => {
    if (key && !key.startsWith('sk-')) {
      return setError('key', { message: 'Invalid' })
    }
    setAPIKey(key || undefined)
    if (onConfirm) onConfirm()
  };

  return (
    <Stack
      width="full"
    >
      <Text>In order to submit custom questions, you need to provide your own OpenAI API key</Text>
      <Text>The API key is only stored locally in your device and nowhere else</Text>
      <Input
        inputLeftAddon={<FiKey />}
        placeholder="Enter your API Key from ChatGPT here."
        {...register('key', { value: apiKey })}
        errorMessage={errors.key?.message}
        autoFocus
      />
      <Button
        colorScheme="green"
        onClick={handleSubmit(handleChangeAPIKey)}
      >Change API Key</Button>
    </Stack>
  )
};
