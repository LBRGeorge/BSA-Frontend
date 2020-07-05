import React, { Component, createContext } from 'react'
import { loadStorage } from '../AuthContext'
import { Pagination } from '../../interfaces/pagination'
import {
  setToken,
  ApiResponse,
  RequestProduct,
  productListRequest,
  productDetailRequest,
  productCreateRequest,
  productUpdateRequest,
  productDeleteRequest
} from '../../services/api'

// Product interface
export interface Product {
  _id: string
  name: string
  description: string
  price: Number
  quantity: Number
  category: any
  brand: any
}

// Whole context data
interface ProductContextData {
  fetching: boolean
  error: string | null
  errorObjects: any
  product: Product | null
  products: Array<Product> | null
  deletedId: string | null

  // Pagination
  pagination: Pagination | null

  resetErrors: Function
  requestProductList: Function
  requestProductDetail: Function
  requestProductCreate: Function
  requestProductUpdate: Function
  requestProductDelete: Function
}

// Create context
const { Provider, Consumer } = createContext({} as ProductContextData)

export const ProductConsumer = Consumer

export class ProductProvider extends Component {
  state = {
    fetching: false,
    error: null,
    errorObjects: null,
    product: null,
    products: null,
    deletedId: null,
    pagination: null
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
   * Get products list
   * 
   * @param payload 
   */
  requestProductList = (payload: any) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null,
      product: null,
      deletedId: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await productListRequest(payload)

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Get product detail
   * 
   * @param payload 
   */
  requestProductDetail = (id: string) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await productDetailRequest(id)

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Create a new product
   * 
   * @param payload 
   */
  requestProductCreate = (payload: RequestProduct) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null,
      product: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await productCreateRequest(payload)

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Update an existing product
   * 
   * @param payload 
   */
  requestProductUpdate = (payload: RequestProduct) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null,
      product: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await productUpdateRequest(payload)

      // Process our response
      this.processResponse(response)
    })
  }

  /**
   * Delete an existing product
   * 
   * @param payload 
   */
  requestProductDelete = (id: string) => {
    this.setState({
      fetching: true,
      error: null,
      errorObjects: null,
      deletedId: null
    }, async () => {
      // Make request
      const response: ApiResponse<any> = await productDeleteRequest(id)

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
      const { product, products, total, limit, currentPage, deletedId }: any = data
      
      // We just need to update what the request returned :P
      let updateObj: any = {}
      if (product) updateObj['product'] = product
      if (products && products !== undefined) updateObj['products'] = products
      if (deletedId) updateObj['deletedId'] = deletedId

      // If we do currentPage key, so we are dealing with a pagination
      if (currentPage) {
        updateObj['pagination'] = {
          total,
          limit,
          currentPage
        }
      }

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
    const { fetching, error, errorObjects, product, products, deletedId, pagination } = this.state

    return (
      <Provider 
        value={{
          // States
          fetching,
          error,
          errorObjects,
          product,
          products,
          deletedId,

          // Pagination state
          pagination,
        
          // Dispatches
          resetErrors: this.resetErrors,
          requestProductList: this.requestProductList,
          requestProductDetail: this.requestProductDetail,
          requestProductCreate: this.requestProductCreate,
          requestProductUpdate: this.requestProductUpdate,
          requestProductDelete: this.requestProductDelete,
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
}
