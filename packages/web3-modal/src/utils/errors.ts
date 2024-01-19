import { ErrorCauses } from '../constants/errors'

export function mapErrorToCauseEnum(error: any) {
  // Connector not found
  if (!!error?.message?.match(/Connector(NotFound(Error)?)|\s?not\s?found/g)) {
    return ErrorCauses.ConnectorNotFoundError
  }
  // Provider not found
  else if (!!error?.message?.match(/Provider(NotFound(Error)?)|\s?not\s?found/g)) {
    return ErrorCauses.ProviderNotFoundError
  }

  return ErrorCauses.GenericError
}

export function isProviderOrConnectorNotFoundError(error: any) {
  return [ErrorCauses.ConnectorNotFoundError, ErrorCauses.ProviderNotFoundError].includes(mapErrorToCauseEnum(error))
}
