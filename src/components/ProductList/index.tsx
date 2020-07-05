import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, Space, Modal, Popconfirm, Button, Input } from 'antd'
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { Product } from '../Forms'
import { CategoryProvider, CategoryConsumer } from '../../context/CategoryContext'
import { BrandProvider, BrandConsumer } from '../../context/BrandContext'

type ProductListProps = {
  loading: boolean,
  products: Array<Object>
  product: any
  deletedId: any
  pagination: any
  categories: any

  loadCategories: Function | null
  loadProducts: Function
  updateProduct: Function | null
  deleteProduct: Function | null
}

export default class ProductList extends Component<ProductListProps> {
  
  static defaultProps = {
    loading: false,
    products: [],
    product: null,
    deletedId: null,
    pagination: null,
    categories: null,
  
    loadProducts: () => {},

    // why here we are defining these null? That's simple!
    // since we use this same component in Categories and Brands details
    // we cannot use these methods in those components, because over there is just readonly
    // we are only allowed to use these methods in Products page :P
    updateProduct: null,
    deleteProduct: null,
    loadCategories: null,
  }

  state = {
    loading: false,
    editing: null,
    modalVisible: false
  }

  // Search input reference
  searchInput: any = null

  tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: any) => <Link to={`/products/${record._id}`}>{text}</Link>,
      filterIcon: (filtered: any) => <SearchOutlined  style={{ color: filtered ? '@primary-color' : undefined }} />,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              this.searchInput = node;
            }}
            placeholder='Search for product'
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      responsive: ['md'] as any,
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      responsive: ['md'] as any,
      filters: [] as any,
      filterMultiple: false,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      responsive: ['md'] as any,
      render: (text: any) => <b>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(text)}</b>
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      responsive: ['md'] as any,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: any) => (
        <Space size='middle'>
          <Button type="dashed" shape="round" icon={<EditOutlined />} onClick={() => this.edit(record)} />

          <Popconfirm title='Really want to delete?' onConfirm={() => this.delete(record)}>
            <Button type="dashed" shape="round" danger={true} icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  constructor(props: any) {
    super(props)

    // Remove actions from table, when managament methods are not available
    if (!props.updateProduct && !props.deleteProduct) {
      this.tableColumns = this.tableColumns.filter(col => col.key !== 'action')

      // Also remove search filter, because it will not be avaiable
      delete this.tableColumns[0].filterIcon
      delete this.tableColumns[0].filterDropdown
    }

    // Remove category column when it is not available
    if (!props.loadCategories) {
      this.tableColumns = this.tableColumns.filter(col => col.key !== 'category')
    }
  }

  /**
   * Get component state updated from props
   * 
   * @param newProps 
   * @param newState 
   */
  static getDerivedStateFromProps(newProps: any, newState: any) {
    // Making request
    if (newProps.loading && !newState.loading) {
      newState.loading = true
    }

    // Request was made
    if (!newProps.loading && newState.loading) {
      newState.loading = false

      // We got data updated?
      if (newProps.product) {
        newState.modalVisible = false
        newState.editing = null
        newProps.loadProducts()
      }

      // We got data deleted?
      if (newProps.deletedId) {
        newProps.loadProducts()
      }
    }

    return newState
  }

  componentDidMount() {
    this.props.loadProducts({ limit: 5 })

    if (this.props.loadCategories) {
      this.props.loadCategories({ noPagination: true })
    }
  }

  /**
   * Edit entity
   * 
   * @param entity 
   */
  edit = (entity: any) => {
    this.setState({
      modalVisible: true,
      editing: entity
    })
  }

  /**
   * Delete entity
   * 
   * @param entity 
   */
  delete = (entity: any) => {
    const { deleteProduct }: any = this.props
    deleteProduct(entity._id)
  }

  /**
   * Close modal
   */
  handleCancel = () => {
    this.setState({
      modalVisible: false,
      editign: null
    })
  }

  /**
   * Generic save data
   * 
   * @param data 
   * @param dispatch 
   */
  handleSave = (data: any, dispatch: Function) => {
    dispatch(data)
  }

  /**
   * Generic table change props and dispatch
   * 
   * @param page 
   * @param dispatch 
   */
  handleTableChange = (pagination: any, filters: any, sorter: any, dispatch: any) => {
    console.log(filters)
    const payload: any = {
      limit: pagination.pageSize,
      page: pagination.current
    }

    // Parse filters to payload params
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        payload[key] = filters[key].toString()
      }
    })
    
    dispatch(payload)
  }

  render() {
    const { loading, products, pagination, categories, loadProducts, updateProduct }: any = this.props
    const { modalVisible, editing } = this.state

    let paginationOptions = {}
    if (pagination) {
      paginationOptions = {
        total: pagination.total,
        pageSize: pagination.limit,
        current: pagination.currentPage
      }
    }

    // Setup filters
    if (categories) {
      this.tableColumns[2].filters = categories.map((category: any) => {
        return {
          value: category._id,
          text: category.name
        }
      })
    }

    return (
      <>
        <Table
          loading={loading}
          rowKey='_id' 
          columns={this.tableColumns} 
          dataSource={products} 
          pagination={paginationOptions}
          onChange={(pagination, filters, sorter) => this.handleTableChange(pagination, filters, sorter, loadProducts)} 
        />

        <Modal
          title='Product'
          visible={modalVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          { 
            modalVisible ? (
              <CategoryProvider>
                <BrandProvider>
                  <CategoryConsumer>
                    {({ requestCategoryList }) => (
                      <BrandConsumer>
                        {({ requestBrandList }) => (
                          <Product
                            data={editing}
                            loadCategories={requestCategoryList}
                            loadBrands={requestBrandList}
                            onUpdate={(values: any) => this.handleSave(values, updateProduct)}
                          />
                        )}
                      </BrandConsumer>
                    )}
                  </CategoryConsumer>
                  
                </BrandProvider>
              </CategoryProvider>
            ) : null 
          }
        </Modal>
      </>
    )
  }
}
