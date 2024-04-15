import sharp from 'sharp'
import friends from './src/data/friends.js'
import {sharpsFromIco} from 'sharp-ico'

for (let i = 0; i < friends.length; i++) {
  let friend = friends[i]

  process.stdout.write(`generating logo for [${friend.name}] `)
  let timer = setInterval(function () {
    process.stdout.write('.')
  }, 100)

  let avatarReq = await fetch(friend.avatar)
  let avatar = await avatarReq.arrayBuffer()
  let sharpInstance
  let avatarType = avatarReq.headers.get('content-type')
  if (avatarType === 'image/x-icon' || avatarType === 'image/vnd.microsoft.icon') {
    [sharpInstance] = sharpsFromIco(Buffer.from(avatar), {})
  } else {
    sharpInstance = sharp(avatar)
  }

  await sharpInstance.resize(128).png({
    quality: 80
  }).toFile(`./public/friends_logo/${friend.name}.png`)

  console.log('👌')

  clearInterval(timer)
}
