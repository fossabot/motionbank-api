import primus from '@feathersjs/primus'
import channels from './channels'

// TODO: https://docs.feathersjs.com/api/client/primus.html
// TODO: https://github.com/primus/metroplex
// TODO: https://github.com/mmalecki/primus-redis-rooms

export default {
  provider: {
    primus: primus({ transformer: 'uws' })
  },
  channels
}
