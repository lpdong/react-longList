
import faker from 'faker'

let arr = []

for(let i = 0; i<10000; i++) {
  arr.push({
    id: i,
    value: faker.lorem.sentences()
  })
}

export default arr