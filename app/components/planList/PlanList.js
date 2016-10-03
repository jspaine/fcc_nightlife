import React from 'react'
import {Card, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card'
import {Button} from 'react-toolbox/lib/button'

import {generateNames, generateTime, inPlans} from 'lib/helpers'

export default ({plans, savePlan, deletePlan, user, usersPlans}) =>
  <ul style={{
    listStyle: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: '1rem'
  }}>
    {plans.map(plan =>
      <li
        key={plan._id}
        style={{
          margin: '1rem',
          flexGrow: 1
        }}
      >
        <Card>
          <CardTitle
            title={plan.venue.name}
            subtitle={generateTime(plan.time)}
            avatar={plan.venue.image_url}
          />
          <CardText>
              {`${plan.user.username} ${plan.others ? ' and ' + plan.others : ''} ${plan.others > 0 ? (plan.others > 1 ? ' others' : 'other') : ''}`}
              {` added ${generateTime(plan.createdAt)}`}
          </CardText>
          {user && !getInUsersPlans(plan, usersPlans) &&
            <CardActions>
              <Button
                icon="group_add"
                onClick={() => savePlan(plan)}
              >
                Join
              </Button>
            </CardActions>
          }
          {user && getInUsersPlans(plan, usersPlans) &&
            <CardActions>
              <Button
                icon="cancel"
                onClick={() => deletePlan(getInUsersPlans(plan, usersPlans)._id)}
              >
                Cancel
              </Button>
            </CardActions>
          }
        </Card>
      </li>
    )}
  </ul>

function getInUsersPlans(plan, usersPlans) {
  const results = usersPlans.filter(p =>
    p.venue.id === plan.venue.id && p.time === plan.time
  )
  return results.length > 0 ? results[0] : null
}
