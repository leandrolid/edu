import { AxiosHttpClient } from '@/http/clients/axios-client'
import type { HttpClient } from '@/http/clients/client'

export const httpClient: HttpClient = new AxiosHttpClient()
