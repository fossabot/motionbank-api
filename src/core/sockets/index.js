import primus from '@feathersjs/primus'
import channels from './channels'

export default {
  provider: {
    primus: primus({ transformer: 'websockets' })
  },
  channels
}
