import React, {Component} from 'react'

import {VenueCard} from 'components'

export default class extends Component {
  render() {
    const {venues, plansByVenue, user, savePlan} = this.props
    return (
      <div>
        {venues.map(venue =>
          <VenueCard
            key={venue.id}
            venue={venue}
            plans={plansByVenue(venue.id)}
            user={user}
            savePlan={savePlan}
          />
        )}
      </div>
    )
  }
}
