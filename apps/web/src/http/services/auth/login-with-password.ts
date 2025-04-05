import { httpClient } from '@/http/clients'

export const loginWithPassword = async (input: { email: string; password: string }) => {
  return httpClient.request<LoginWithPasswordOutput>({
    url: 'auth/signin',
    method: 'POST',
    body: {
      email: input.email,
      password: input.password,
    },
  })
}

type LoginWithPasswordOutput = {
  data: {
    token: string
  }
}
