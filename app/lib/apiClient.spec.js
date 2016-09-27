import fetchMock from 'fetch-mock'
import {TestScheduler} from 'rxjs/testing/TestScheduler'
import {Observable} from 'rxjs/Observable'

import api from './apiClient'

describe('api client', function() {
  afterEach(fetchMock.restore)

  it('gets', function() {

    // const mockResult = [
    //   {_id: 100, title: 'poll 1'},
    //   {_id: 101, title: 'poll 2'}
    // ]

    // fetchMock.get(/\/api\/polls/, Observable.of(mockResult))

    // const testScheduler = new TestScheduler((actual, expected) => {
    //   expect(actual).to.deep.equal(expected)
    // })
    // const action$ = testScheduler.createHotObservable('a', {
    //   a: api.get('api/polls')
    // })

    // testScheduler.expectObservable(action$).toBe('-a|', {
    //   a: mockResult
    // })
    // testScheduler.flush()
  })
})
