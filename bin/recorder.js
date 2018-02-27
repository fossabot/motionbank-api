const
  path = require('path'),
  uuidv4 = require('uuid/v4'),
  spawn = require('child_process').spawn

const cmd = 'bmdcapture',
  args = ('-m 7 -A 2 -v -V 3 -c 2 -d 0 -F nut -C 0 -o strict=normal:syncpoints=default -f pipe:1 | ' +
    'avconv -r 25 -y -i - ' +
    '-c:a libfdk_aac -ac 2 -b:a 96k -ar 44100 -c:v libx264 -pix_fmt yuv420p -profile:v main -level 32 -b:v 1000K ' +
    '-r 25 -f mp4 -vf "scale=1280:-1"').split(' '),
  args2 = ('-m 7 -A 2 -V 3 -c 2 -d 0 -F nut -C 0 -f pipe:1 | ' +
  'ffmpeg -y -r 25 -probesize 10M -analyzeduration 2M -i - ' +
  '-c:a libfdk_aac -ac 2 -b:a 96k -ar 44100 -c:v libx264 -pix_fmt yuv420p -profile:v main -level 32 -b:v 1000K ' +
  '-r 25 -f mp4 -vf "scale=1280:-1"').split(' '),
  outfile = path.join(__dirname, '..', 'media', `${uuidv4()}.mp4`)

const capture = spawn(cmd, args.concat([outfile]), { shell: true })

capture.stdout.on('data', (data) => {
  console.log(`${cmd} stdout: ${data}`)
})

capture.stderr.on('data', (data) => {
  console.log(`${cmd} stderr: ${data}`)
})

capture.on('close', (code) => {
  console.log(`${cmd} exited with code ${code}`)
  process.exit(0)
})
