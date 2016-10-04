import React from 'react'
import {Card, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card'
import {Button} from 'react-toolbox/lib/button'

import {generateNames, generateTime, inPlans, getEventInUsersPlans} from 'lib/helpers'
import {YelpButton} from 'components'
import style from './PlanList.scss'
import titleTheme from 'theme/cardTitle.scss'

export default ({plans, savePlan, deletePlan, user, usersPlans}) =>
  <ul className={style.list}>
    {plans.map(plan =>
      <li key={plan._id} className={style.plan}>
        <Card>
          <CardTitle
            title={plan.venue.name}
            subtitle={generateTime(plan.time)}
            avatar={plan.venue.image_url}
            theme={titleTheme}
          />
          <CardText>
              {`${plan.user.username} ${plan.others ? ' and ' + plan.others : ''}`}
              {`${plan.others > 0 ? (plan.others > 1 ? ' others' : 'other') : ''}`}
              {` added ${generateTime(plan.createdAt)}`}
          </CardText>
          <CardActions>
            <YelpButton id={plan.venue.id} />
            {user && !getEventInUsersPlans(plan, usersPlans) &&
              <Button
                icon="group_add"
                onClick={() => savePlan(plan)}
              >
                Join
              </Button>
            }
            {user && getEventInUsersPlans(plan, usersPlans) &&
              <Button
                icon="cancel"
                onClick={() => deletePlan(
                  getEventInUsersPlans(plan, usersPlans)._id
                )}
              >
                Cancel
              </Button>
            }
          </CardActions>
        </Card>
      </li>
    )}
  </ul>


