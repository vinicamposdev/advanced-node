import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repositories'
import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser)

  async load ({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepo.findOne({ email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ email, name, facebookId, id }: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    if (id === undefined) {
      const pgUser = await this.pgUserRepo.save({
        email,
        name,
        facebookId
      })
      return { id: pgUser.id.toString() }
    }
    await this.pgUserRepo.update(id, {
      name,
      facebookId
    })
    return { id }
  }
}
