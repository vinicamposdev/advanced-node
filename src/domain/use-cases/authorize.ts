import { TokenValidator } from '@/domain/contracts/crypto'

type Setup = (crypto: TokenValidator) => Authorize
type Input = {token: string}
type Output = string
export type Authorize = (paramas: Input) => Promise<Output>

export const setupAuthorize: Setup = crypto => async params => crypto.validateToken(params)
