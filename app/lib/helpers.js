import moment from 'moment'

function generateNames(plans, maxNames) {
  const names = plans.map(plan => plan.user.username).slice(0,3)
  const extras = plans.length - names.length

  if (names.length === 1)
    return `${names[0]}`

  if (extras) {
    names.pop()
    names.push(`${extras} ${extras > 1 ? 'others' : 'other'}`)
  }

  return names.slice(0, names.length - 1).join(', ').concat(` and ${names[names.length - 1]}`)
}

function generateTime(time) {
  return moment(time)
    .calendar(null, {
      lastDay : '[Yesterday at] LT',
      sameDay : '[Today at] LT',
      nextDay : '[Tomorrow at] LT',
      lastWeek : '[last] dddd [at] LT',
      nextWeek : 'dddd [at] LT',
      sameElse : 'dddd DD MMM YYYY [at] LT'
    })
}

function inPlans(plans, user) {
  return user && plans.map(plan => plan.user.username)
    .filter(username => user.username === username)
    .length > 0
}

export {generateNames, generateTime, inPlans}
