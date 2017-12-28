import * as pkg from '../package.json'
const
  appConfig = pkg.appConfig,
  idField = process.env.ID_FIELD || appConfig.idField,
  apiHost = process.env.API_HOST || (process.env.NODE_ENV === 'production'
    ? appConfig.apiHost : appConfig.apiHostLocal)

export default {
  apiHost,
  idField
}
