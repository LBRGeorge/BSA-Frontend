import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, Space, Modal, Popconfirm, Button } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Brand } from '../Forms'

type BrandListProps = {
  loading: boolean
  brands: Array<Object>
  brand: any
  deletedId: any
  
  loadBrands: Function
  updateBrand: Function
  deleteBrand: Function
}

export default class BrandList extends Component<BrandListProps> {

  static defaultProps = {
    brand: null,
    deletedId: null
  }

  state = {
    loading: false,
    editing: null,
    modalVisible: false
  } 

  tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => <Link to={`/brands/${record._id}`}>{text}</Link>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      responsive: ['md'] as any,
    },
    {
      title: 'Products',
      dataIndex: 'numProducts',
      key: 'numProducts',
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
      if (newProps.brand) {
        newState.modalVisible = false
        newState.editing = null
        newProps.loadBrands()
      }

      // We got data deleted?
      if (newProps.deletedId) {
        newProps.loadBrands()
      }
    }

    return newState
  }

  componentDidMount() {
    this.props.loadBrands()
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
    this.props.deleteBrand(entity._id)
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

  render() {
    const { loading, brands, updateBrand } = this.props
    const { modalVisible, editing } = this.state

    return (
      <>
        <Table loading={loading} rowKey='_id' columns={this.tableColumns} dataSource={brands} />

        <Modal
          title='Brand'
          visible={modalVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          { 
            modalVisible ? (
              <Brand
                data={editing}
                onUpdate={(values: any) => this.handleSave(values, updateBrand)}
              />
            ) : null 
          }
        </Modal>
      </>
    )
  }
}
