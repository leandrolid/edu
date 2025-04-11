export const getMembers = async (slug: string) => {
  // return httpClient.request<GetMembersOutput>({
  //   url: `/organizations/${slug}/members`,
  //   method: 'GET',
  // })
  return {
    data: [
      {
        id: '1',
        userId: '1',
        name: 'Lucas Almeida',
        email: 'lucasalmeida@example.com',
        roles: ['ADMIN'],
      },
    ],
  }
}

type GetMembersOutput = {
  data: Array<{
    id: string
    userId: string
    name: string
    email: string
    roles: string[]
  }>
}
