export type CreateOrganizationInput = {
  name: string
  slug: string
  domain: string | null
  avatarUrl: string | null
  shouldAttachUserByDomain: boolean
  // color: string
  // plan: string
}
