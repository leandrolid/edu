import '@infra/_injection/register'

import { Container } from '@infra/_injection'
import { BasicSignInController } from '@infra/http/controllers/auth/basic-sign-in/basic-sign-in.controller'
import { GetMembersController } from '@infra/http/controllers/members/get-members/get-member.controller'
import { CreateOrganizationController } from '@infra/http/controllers/organizations/create-organization/create-organization.controller'
import { GetOrganizationController } from '@infra/http/controllers/organizations/get-organization/get-organization.controller'
import { GetOrganizationsController } from '@infra/http/controllers/organizations/get-organizations/get-organizations.controller'
import { UpdateOrganizationController } from '@infra/http/controllers/organizations/update-organization/update-organization.controller'
import { CreateTeamController } from '@infra/http/controllers/teams/create-team/get-teams.controller'
import { GetTeamsController } from '@infra/http/controllers/teams/get-teams/get-teams.controller'
import { CreateAccountController } from '@infra/http/controllers/users/create-account/create-account.controller'
import { HttpErrorHandler } from '@infra/http/errors/error.handler'
import { FastifyServer } from '@infra/http/servers/fastify.server'

const PORT = Number(process.env.PORT || 3333)
const app = Container.instance.resolve(FastifyServer)
app.cors()
app.registerValidationProvider()
app.registerDocs()
app.registerControllers([CreateAccountController])
app.registerControllers([BasicSignInController])
app.registerControllers([
  CreateOrganizationController,
  GetOrganizationsController,
  GetOrganizationController,
  UpdateOrganizationController,
])
app.registerControllers([GetMembersController])
app.registerControllers([CreateTeamController, GetTeamsController])
app.registerErrorHandler(new HttpErrorHandler())
app.start(PORT)
