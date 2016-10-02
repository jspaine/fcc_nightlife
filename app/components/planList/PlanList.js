import React from 'react'
import {Card, CardTitle} from 'react-toolbox/lib/card'

import {generateNames, generateTime, inPlans} from 'lib/helpers'

export default ({plan}) =>
  <Card>
    <CardTitle
      title={plan.venue.name}
      subtitle={generateTime(plan.time)}
    />
    <CardText>

    <CardText>
  </Card>
