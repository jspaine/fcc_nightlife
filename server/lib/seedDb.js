import User from '~/api/user/model'
import Plan from '~/api/plan/model'

async function seed(clear) {
  clear && await clearAll()
  await seedUsers()
  await seedPlans()
}

async function clearAll() {
  await clearUsers()
  await clearPlans()
}

async function clearUsers() { await User.find().remove() }
async function clearPlans() { await Plan.find().remove() }

async function seedUsers() {
  const users = await User.count()
  if (users) return
  await User.create({
    username: 'admin',
    password: '1234',
    role: 'admin',
    image: 'http://placeimg.com/64/64/animals'
  })
  await User.create({
    username: 'test',
    password: '1234',
    image: 'http://placeimg.com/64/64/tech'
  })
}

async function seedPlans() {
  const plans = await Plan.count()
  if (plans) return
  const user1 = await User.findOne({username: 'admin'})
  const user2 = await User.findOne({username: 'test'})
  const now = Date.now()
  await Plan.create({
    user: user1,
    venue: {
      id: 'aint-nothin-but-london',
      name: 'Ain\'t Nothin\' But...',
      image_url: 'https://s3-media4.fl.yelpcdn.com/bphoto/C1mZteExdl-Xu-gNzizsRQ/o.jpg'
    },
    time: now + 70000000
  })
  await Plan.create({
    user: user2,
    venue: {
      id: 'aint-nothin-but-london',
      name: 'Ain\'t Nothin\' But...',
      image_url: 'https://s3-media4.fl.yelpcdn.com/bphoto/C1mZteExdl-Xu-gNzizsRQ/o.jpg'
    },
    time: now + 70000000
  })
  await Plan.create({
    user: user1,
    venue: {
      id: 'nightjar-london',
      name: 'Nightjar',
      image_url: 'https://s3-media1.fl.yelpcdn.com/bphoto/xCgggQXLi7uhrDysPE9P0w/o.jpg'
    },
    time: now + 50000000
  })
  await Plan.create({
    user: user2,
    venue: {
      id: 'nightjar-london',
      name: 'Nightjar',
      image_url: 'https://s3-media1.fl.yelpcdn.com/bphoto/xCgggQXLi7uhrDysPE9P0w/o.jpg'
    },
    time: now + 50000000
  })
}

export default seed
