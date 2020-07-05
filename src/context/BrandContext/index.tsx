import React, { Component, createContext } from 'react'
import { loadStorage } from '../AuthContext'
import {
  setToken,
  ApiResponse,
  RequestBrand,
  brandListRequest,
  brandDetailRequest,
  brandCreateRequest,
  brandUpdateRequest,
  brandDeleteRequest
  } from '../../services/api'

// Brand interface
export interface Brand {
  id: string
  name: string
  description: string,
  numProducts?: Number
  products?: Array<any>
}

// Whole context data
interface BrandContextData {
  fetching: boolean
  error: string | null
  errorObjects: any
  brand: Brand | null
  brands: Array<Brand> | null
  deletedId: string | null

  resetErrors: Function
  requestBrandList: Function
  requestBrandDetail: Function
  requestBrandCreate: Function
  requestBrandUpdate: Function
  requestBrandDelete: Function
}

// Create context
const { Provider, Consumer } = createContext({} as BrandContextData)

export const BrandConsumer = Consumer

export class BrandProvider extends Component {
  state = {
    fetching: false,
    error: null,
    errorObjects: null,
    brand: null,
    brands: null,
    deletedId: null
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
   * @param payload 
   */
  requestBrandList = (payload: any) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null,
      brand: null,
      deletedId: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await brandListRequest(payload)

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Get brand detail
   * 
   * @param payload 
   */
  requestBrandDetail = (id: string) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await brandDetailRequest(id)

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Create a new brand
   * 
   * @param payload 
   */
  requestBrandCreate = (payload: RequestBrand) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null,
      brand: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await brandCreateRequest(payload)

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Update an existing brand
   * 
   * @param payload 
   */
  requestBrandUpdate = (payload: RequestBrand) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null,
      brand: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await brandUpdateRequest(payload)

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Delete an existing brand
   * 
   * @param payload 
   */
  requestBrandDelete = (id: string) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null,
      deletedId: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await brandDeleteRequest(id)

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
      const { brand, brands, deletedId }: any = data
      
      // We just need to update what the request returned :P
      let updateObj: any = {}
      if (brand) updateObj['brand'] = brand
      if (brands) updateObj['brands'] = brands
      if (deletedId) updateObj['deletedId'] = deletedId

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
    const { fetching, error, errorObjects, brand, brands, deletedId } = this.state

    return (
      <Provider 
        value={{
          // States
          fetching,
          error,
          errorObjects,
          brand,
          brands,
          deletedId,
        
          // Dispatches
          resetErrors: this.resetErrors,
          requestBrandList: this.requestBrandList,
          requestBrandDetail: this.requestBrandDetail,
          requestBrandCreate: this.requestBrandCreate,
          requestBrandUpdate: this.requestBrandUpdate,
          requestBrandDelete: this.requestBrandDelete,
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
}
