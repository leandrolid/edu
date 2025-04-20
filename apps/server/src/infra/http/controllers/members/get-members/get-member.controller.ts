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
} from '@infra/_injection'
import { GetMembersValidation } from '@infra/http/controllers/members/get-members/get-member.validation'
import { IController } from '@infra/http/interfaces/controller'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Get all members',
  tags: ['Members'],
})
@Controller('/organizations')
@MiddleWares(JwtMiddleware)
export class GetMembersController implements IController {
  constructor(private readonly getMembersUseCase: GetMembersUseCase) {}

  @Get('/:slug/members')
  @Validate(new GetMembersValidation())
  async execute(
    @User() user: IUser,
    @Params() params: Pick<GetMembersInput, 'slug'>,
    @Query() query: Omit<GetMembersInput, 'slug'>,
  ) {
    const output = await this.getMembersUseCase.execute({
      user,
      slug: params.slug,
      teamId: query.teamId,
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
    })
    return { data: output.members, metadata: output.metadata }
  }
}
