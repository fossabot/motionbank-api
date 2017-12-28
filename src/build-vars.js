import * as pkg from '../package.json'

export default function () {
  const
    appConfig = pkg.appConfig,
    uuidUnknown = '00000000-0000-0000-0000-000000000000',
    idField = process.env.ID_FIELD || appConfig.idField,
    apiHost = process.env.API_HOST || (process.env.NODE_ENV === 'production'
      ? appConfig.apiHost : appConfig.apiHostLocal)

  return {
    apiHost,
    idField,
    uuidUnknown
  }
}
