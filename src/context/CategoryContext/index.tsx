import React, { Component, createContext } from 'react'
import { loadStorage } from '../AuthContext'
import {
  setToken,
  ApiResponse,
  RequestCategory,
  categoryListRequest,
  categoryDetailRequest,
  categoryCreateRequest,
  categoryUpdateRequest,
  categoryDeleteRequest } from '../../services/api'

// Category interface
export interface Category {
  id: string
  name: string
  description: string,
  numProducts?: Number
  products?: Array<any>
}

// Whole context data
interface CategoryContextData {
  fetching: boolean
  error: string | null
  errorObjects: any
  category: Category | null
  categories: Array<Category> | null
  deletedId: string | null

  resetErrors: Function
  requestCategoryList: Function
  requestCategoryDetail: Function
  requestCategoryCreate: Function
  requestCategoryUpdate: Function
  requestCategoryDelete: Function
}

// Create context
const { Provider, Consumer } = createContext({} as CategoryContextData)

export const CategoryConsumer = Consumer

export class CategoryProvider extends Component {
  state = {
    fetching: false,
    error: null,
    errorObjects: null,
    category: null,
    categories: null,
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
   * Get categories list
   * 
   * @param payload 
   */
  requestCategoryList = (payload: any) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null,
      category: null,
      deletedId: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await categoryListRequest(payload)

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Get category detail
   * 
   * @param payload 
   */
  requestCategoryDetail = (id: string) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await categoryDetailRequest(id)

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Create a new category
   * 
   * @param payload 
   */
  requestCategoryCreate = (payload: RequestCategory) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null,
      category: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await categoryCreateRequest(payload)

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Update an existing category
   * 
   * @param payload 
   */
  requestCategoryUpdate = (payload: RequestCategory) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null,
      category: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await categoryUpdateRequest(payload)

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Delete an existing category
   * 
   * @param payload 
   */
  requestCategoryDelete = (id: string) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null,
      deletedId: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await categoryDeleteRequest(id)

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
      const { category, categories, deletedId }: any = data
      
      // We just need to update what the request returned :P
      let updateObj: any = {}
      if (category) updateObj['category'] = category
      if (categories) updateObj['categories'] = categories
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
    const { fetching, error, errorObjects, category, categories, deletedId } = this.state

    return (
      <Provider 
        value={{
          // States
          fetching,
          error,
          errorObjects,
          category,
          categories,
          deletedId,
        
          // Dispatches
          resetErrors: this.resetErrors,
          requestCategoryList: this.requestCategoryList,
          requestCategoryDetail: this.requestCategoryDetail,
          requestCategoryCreate: this.requestCategoryCreate,
          requestCategoryUpdate: this.requestCategoryUpdate,
          requestCategoryDelete: this.requestCategoryDelete,
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
}
