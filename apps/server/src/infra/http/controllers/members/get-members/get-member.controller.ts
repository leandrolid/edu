import type { GetMembersInput } from '@app/members/get-members/get-members.input'
import { GetMembersUseCase } from '@app/members/get-members/get-members.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import {
  Controller,
  Docs,
  Get,
  MiddleWares,
  Params,
  Query,
  User,
  Validate,
  type IController,
} from '@edu/framework'
import { GetMembersValidation } from '@infra/http/controllers/members/get-members/get-member.validation'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Get all members',
  tags: ['Members'],
})
@Controller('/organizations')
@MiddleWares(JwtMiddleware)
export class GetMembersController implements IController {
  constructor(private readonly getMembersUseCase: GetMembersUseCase) {}

  @Get('/:slug/teams/:team/members')
  @Validate(new GetMembersValidation())
  async execute(
    @User() user: IUser,
    @Params() params: Pick<GetMembersInput, 'slug' | 'team'>,
    @Query() query: Omit<GetMembersInput, 'slug' | 'team'>,
  ) {
    const output = await this.getMembersUseCase.execute({
      user,
      slug: params.slug,
      team: params.team,
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
    })
    return { data: output.members, metadata: output.metadata }
  }
}
