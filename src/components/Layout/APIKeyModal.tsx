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
  const { setAPIKey } = useApiKey()
  const { register, handleSubmit, reset, setError, formState: { errors, } } = useForm<APIKeyScheme>();

  const handleChangeAPIKey = ({ key }: APIKeyScheme) => {
    if (!key) {
      return setError('key', { message: 'Required' })
    }
    if (!key.startsWith('sk-')) {
      return setError('key', { message: 'Invalid' })
    }
    setAPIKey(key)
    reset({ key: "" })
    if (onConfirm) onConfirm()
  };

  return (
    <Stack
      width="full"
    >
      <Text>In order to submit custom questions, you need to provide your own OpenAPI API key</Text>
      <Input
        inputLeftAddon={<FiKey />}
        placeholder="Enter your API Key from ChatGPT here."
        {...register('key')}
        errorMessage={errors.key?.message}
        isRequired
      />
      <Button
        colorScheme="green"
        onClick={handleSubmit(handleChangeAPIKey)}
      >Change API Key</Button>
    </Stack>
  )
};
