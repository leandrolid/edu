import { createFastifyServer } from '@edu/framework'
import { BasicSignInController } from '@infra/http/controllers/auth/basic-sign-in/basic-sign-in.controller'
import { GetMembersController } from '@infra/http/controllers/members/get-members/get-member.controller'
import { CreateOrganizationController } from '@infra/http/controllers/organizations/create-organization/create-organization.controller'
import { GetOrganizationController } from '@infra/http/controllers/organizations/get-organization/get-organization.controller'
import { GetOrganizationsController } from '@infra/http/controllers/organizations/get-organizations/get-organizations.controller'
import { UpdateOrganizationController } from '@infra/http/controllers/organizations/update-organization/update-organization.controller'
import { CreateTeamController } from '@infra/http/controllers/teams/create-team/create-team.controller'
import { DeleteTeamController } from '@infra/http/controllers/teams/delete-team/delete-teams.controller'
import { GetTeamController } from '@infra/http/controllers/teams/get-team/get-team.controller'
import { GetTeamsController } from '@infra/http/controllers/teams/get-teams/get-teams.controller'
import { UpdateTeamController } from '@infra/http/controllers/teams/update-team/update-team.controller'
import { CreateAccountController } from '@infra/http/controllers/users/create-account/create-account.controller'
import { HttpErrorHandler } from '@infra/http/errors/error.handler'
import { MemberRepository } from '@infra/repositories/member/member.repository.imp'
import { OrganizationRepository } from '@infra/repositories/organization/organization.repository.imp'
import { TeamRepository } from '@infra/repositories/team/team.repository.imp'
import { UserRepository } from '@infra/repositories/user/user.repository.imp'
import { PermissionService } from '@infra/services/permission/permission.service.imp'
import { TokenService } from '@infra/services/token/token.service.imp'

const PORT = Number(process.env.PORT || 3333)

async function main() {
  const app = createFastifyServer({
    docs: true,
    zodValidation: true,
    cors: ['*'],
    providers: [
      UserRepository,
      OrganizationRepository,
      TeamRepository,
      MemberRepository,
      PermissionService,
      TokenService,
    ],
    controllers: [
      CreateAccountController,
      BasicSignInController,
      CreateOrganizationController,
      GetOrganizationsController,
      GetOrganizationController,
      UpdateOrganizationController,
      GetMembersController,
      CreateTeamController,
      GetTeamsController,
      GetTeamController,
      UpdateTeamController,
      DeleteTeamController,
    ],
    errorHandler: new HttpErrorHandler(),
  })
  await app.start(PORT)
}

main()
