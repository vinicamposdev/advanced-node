import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repositories'
import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'

export class PgUserAccountRepository implements LoadUserAccountRepository {
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

  async saveWithFacebook ({ email, name, facebookId, id }: SaveFacebookAccountRepository.Params): Promise<void> {
    if (id === undefined) {
      await this.pgUserRepo.save({
        email,
        name,
        facebookId
      })
    } else {
      await this.pgUserRepo.update(id, {
        name,
        facebookId
      })
    }
  }
}
