export type CreateOrganizationInput = {
  name: string
  slug: string
  domain: string
  avatarUrl: string | null
  shouldAttachUserByDomain: boolean
  // color: string
  // plan: string
}
