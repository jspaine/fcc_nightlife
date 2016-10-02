import React, {Component, PropTypes} from 'react'
import {Button} from 'react-toolbox/lib/button'
import {DatePicker} from 'react-toolbox/lib/date_picker'
import {TimePicker} from 'react-toolbox/lib/time_picker'

import InvisibleInputPicker from './InvisibleInputPicker.scss'

const SELECT_NONE = 0
const SELECT_DATE = 1
const SELECT_TIME = 2

class VenueAddPlanBtn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selecting: SELECT_NONE,
      date: new Date,
      time: new Date
    }
    this.handleSelecting = this.handleSelecting.bind(this)
    this.handleNoSelect = this.handleNoSelect.bind(this)
    this.handlePicked = this.handlePicked.bind(this)
  }
  handleSelecting() {
    this.setState({selecting: SELECT_DATE})
  }
  handleNoSelect() {
    this.setState({selecting: SELECT_NONE})
  }
  handlePicked(item) {
    return (value) => {
      if (item === 'date') {
        this.setState({
          selecting: SELECT_TIME,
          date: value
        })
      } else {
        let time = this.state.date
        time.setHours(value.getHours())
        time.setMinutes(value.getMinutes())
        time.setSeconds(value.getSeconds())

        this.props.savePlan({
          venue: this.props.venue,
          time
        })

        this.setState({
          selecting: SELECT_NONE,
          date: new Date,
          time: new Date
        })
      }
    }
  }
  render() {
    return (
      <div>
        <Button icon="person_add" onClick={this.handleSelecting}>
          Add Plan
        </Button>
        <DatePicker
          active={this.state.selecting === SELECT_DATE}
          onChange={this.handlePicked('date')}
          onOverlayClick={this.handleNoSelect}
          onEscKeyDown={this.handleNoSelect}
          value={this.state.date}
          theme={InvisibleInputPicker}
        />
        <TimePicker
          active={this.state.selecting === SELECT_TIME}
          onChange={this.handlePicked('time')}
          onOverlayClick={this.handleNoSelect}
          onEscKeyDown={this.handleNoSelect}
          value={this.state.time}
          theme={InvisibleInputPicker}
        />
      </div>
    )
  }
}

export default VenueAddPlanBtn
