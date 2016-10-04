import React, {Component, PropTypes} from 'react'
import {Card, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card'
import {Button} from 'react-toolbox/lib/button'

import {VenuePlans, VenueAddPlanBtn} from 'components'
import style from './VenueCard.scss'
import titleTheme from 'theme/cardTitle.scss'

class VenueCard extends Component {
  constructor(props) {
    super(props)
    this.state = {details: false}
    this.handleShowDetails = this.handleShowDetails.bind(this)
  }

  handleShowDetails() {
    this.setState({details: !this.state.details})
  }

  render() {
    const {venue, plans, user, savePlan, deletePlan} = this.props
    return (
      <Card className={style.card}>
        <div className={style.title}>
          <CardTitle
            onClick={this.handleShowDetails}
            className={style.cardTitle}
            avatar={venue.image_url}
            title={venue.name}
            subtitle={venue.categories.map(cat => cat.title).join(', ')}
            theme={titleTheme}
          />
          <CardText className={style.going}>
            {plans.reduce((acc, x) => acc + x.values.length, 0)} going
          </CardText>
        </div>
        {user &&
          <CardActions>
            <VenueAddPlanBtn venue={venue} savePlan={savePlan} />
          </CardActions>
        }

        {this.state.details &&
          <VenuePlans
            plans={plans}
            savePlan={savePlan}
            deletePlan={deletePlan}
            user={user}
          />
        }
      </Card>
    )
  }

  static propTypes = {
    venue: PropTypes.object.isRequired,
    plans: PropTypes.array,
    user: PropTypes.object,
    savePlan: PropTypes.func.isRequired,
    deletePlan: PropTypes.func.isRequired
  }
}

export default VenueCard
