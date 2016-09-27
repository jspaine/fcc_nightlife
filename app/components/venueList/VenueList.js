import React from 'react'

export default ({venues}) =>
  <div>
    {venues.map(venue =>
      <div>{venue.id}</div>
    )}
  </div>
