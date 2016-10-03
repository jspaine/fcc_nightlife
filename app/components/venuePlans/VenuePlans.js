import React from 'react'
import {Card, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card'
import {Button} from 'react-toolbox/lib/button'
import moment from 'moment'

import {generateNames, generateTime, inPlans} from 'lib/helpers'
import theme from 'theme/smallExpandingCardTitle.scss'

export default ({plans, savePlan, deletePlan, user}) =>
  <ul>
    {plans.map(planGroup =>
      <li style={{display: 'flex', marginLeft: '30px'}} key={planGroup.key}>
        <CardTitle
          theme={theme}
          title={generateNames(planGroup.values, 4)}
          subtitle={generateTime(planGroup.values[0].time)}
        />

        {user && !inPlans(planGroup.values, user) &&
          <CardActions>
            <Button
              icon="group_add"
              onClick={() => savePlan(planGroup.values[0])}
            >
              Join
            </Button>
          </CardActions>
        }
        {user && inPlans(planGroup.values, user) &&
          <CardActions>
            <Button
              icon="cancel"
              onClick={() => deletePlan(
                  planGroup.values.filter(plan => plan.user._id === user._id)
                    .map(plan => plan._id)[0]
              )}
            >
              Cancel
            </Button>
          </CardActions>
        }
      </li>
    )}
  </ul>
