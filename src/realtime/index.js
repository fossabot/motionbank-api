import primus from '@feathersjs/primus'
import channels from './channels'

export default {
  provider: primus({ transformer: 'websockets' }),
  channels: channels
}
