import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repositories'
import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  async load ({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ email, name, facebookId }: SaveFacebookAccountRepository.Params): Promise<void> {
    const pgUserRepo = getRepository(PgUser)
    await pgUserRepo.save({
      email,
      name,
      facebookId
    })
  }
}
