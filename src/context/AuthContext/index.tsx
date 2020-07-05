import React, { Component, createContext } from 'react'
import { ApiResponse, RequestLogin, RequestRegister, loginRequest, registerRequest } from '../../services/api'

// That's our local storage key
const STORAGE_KEY = '@bsa-auth'

// Our authenticated user interface
interface User {
  name: string
  email: string
}

// Whole context data
interface AuthContextData {
  loggedIn: boolean
  fetching: boolean
  error: string | null
  errorObjects: any
  accessToken: string
  refreshToken: string
  user: User | null

  resetErrors: Function
  requestLogin: Function
  requestRegister: Function
  requestLogout: Function
}

/**
 * Load stored data
 */
export const loadStorage = () => {
  const auth = localStorage.getItem(STORAGE_KEY)
  if (!auth) return null

  try {
    const parsed = JSON.parse(auth)

    return parsed
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY)

    return null
  }
}

/**
 * Clear our stored data
 */
export const clearStorage = () => {
  localStorage.clear()
}

/**
 * Save updated data in our storage
 * 
 * @param accessToken 
 * @param user 
 */
export const saveStorage = (accessToken: string, refreshToken: string, user: User) => {
  let auth = loadStorage()
  
  // Update new data
  auth = {
    ...auth,
    accessToken,
    refreshToken,
    user
  }

  // Parse and save data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

// Create context
const { Provider, Consumer } = createContext({} as AuthContextData)

export const AuthConsumer = Consumer

export class AuthProvider extends Component {
  state = {
    loggedIn: false,
    fetching: false,
    error: null,
    errorObjects: null,
    accessToken: '',
    refreshToken: '',
    user: null,
  }

  constructor(props: any) {
    super(props)

    const store = loadStorage()

    // We do have stored user data?
    if (store) {
      this.state = {
        ...this.state,
        ...store,
        loggedIn: true
      }
    }
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
   * Make api request for login
   * 
   * @param payload 
   */
  requestLogin = (payload: RequestLogin) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null
    }, async () => {
      const response: ApiResponse<any> = await loginRequest(payload)

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Make api request for registration
   * 
   * @param payload 
   */
  requestRegister = (payload: RequestRegister) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null
    }, async () => {
      const response: ApiResponse<any> = await registerRequest(payload)
      
      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Logout now!
   */
  requestLogout = () => {
    this.setState({
      etching: false,
      error: null,
      errorObjects: null,
      loggedIn: false,
      accessToken: '',
      refreshToken: '',
      user: null,
    }, () => {
      localStorage.removeItem(STORAGE_KEY)
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
      const { accessToken, refreshToken, user }: any = data

      // Save our new fresh data
      saveStorage(accessToken, refreshToken, user)

      // Update our provider component
      this.setState({
        loggedIn: true,
        fetching: false,
        error: null,
        errorObjects: null,

        accessToken,
        refreshToken,
        user
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
    const { loggedIn, fetching, error, errorObjects, accessToken, refreshToken, user } = this.state

    return (
      <Provider 
        value={{
          // States
          loggedIn,
          fetching,
          error,
          errorObjects,
          accessToken,
          refreshToken,
          user,

          // Dispatches
          resetErrors: this.resetErrors,
          requestLogin: this.requestLogin,
          requestRegister: this.requestRegister,
          requestLogout: this.requestLogout,
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
}
