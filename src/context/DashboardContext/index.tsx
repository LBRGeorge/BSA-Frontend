import React, { Component, createContext } from 'react'
import { loadStorage } from '../AuthContext'
import {
  setToken,
  ApiResponse,
  dashboardStatsRequest
  } from '../../services/api'

// Brand interface
export interface DashboardStats {
  productsTotal: Number
  categoriesTotal: Number
  brandsTotal: Number
}

// Whole context data
interface DashboardContextData {
  fetching: boolean
  error: string | null
  errorObjects: any
  stats: DashboardStats | null

  resetErrors: Function
  requestDashboardStats: Function
}

// Create context
const { Provider, Consumer } = createContext({} as DashboardContextData)

export const DashboardConsumer = Consumer

export class DashboardProvider extends Component {
  state = {
    fetching: false,
    error: null,
    errorObjects: null,
    stats: null,
  }

  componentDidMount() {
    const { accessToken } = loadStorage()

    // Set our private token
    setToken(accessToken)
  }

  /**
   * Reset errors from context
   */
  resetErrors = () => {
    this.setState({
      error: null,
      errorObjects: null
    })
  }

  /**
   * Get brands list
   * 
   */
  requestDashboardStats = () => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null,
      stats: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await dashboardStatsRequest()

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Process every response of this provider
   * 
   * @param response 
   */
  processResponse = (response: ApiResponse<any>) => {
    const { ok, data, problem } = response

    if (ok) {
      const { stats }: any = data
      
      // We just need to update what the request returned :P
      let updateObj: any = {}
      if (stats) updateObj['stats'] = stats

      // Update our provider component
      this.setState({
        loggedIn: true,
        fetching: false,
        error: null,
        errorObjects: null,

        ...updateObj
      })
    } else {
      // By default we should wait for a client error
      let error = problem
      let errorObjects = null

      // If we got some error from our API, so we should be aware of it
      if (data && data.error) {
        error = data.error

        // If we do have some objects error, we need them
        if (data.objects) {
          errorObjects = data.objects
        }
      }

      this.setState({
        fetching: false,
        error,
        errorObjects
      })
    }
  }

  render() {
    const { fetching, error, errorObjects, stats } = this.state

    return (
      <Provider 
        value={{
          // States
          fetching,
          error,
          errorObjects,
          stats,
        
          // Dispatches
          resetErrors: this.resetErrors,
          requestDashboardStats: this.requestDashboardStats,
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
}
