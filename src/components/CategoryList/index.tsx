import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, Space, Modal, Popconfirm, Button } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Category } from '../Forms'

type CategoryListProps = {
  loading: boolean
  categories: Array<Object>
  category: any
  deletedId: any
  
  loadCategories: Function
  updateCategory: Function
  deleteCategory: Function
}

export default class CategoryList extends Component<CategoryListProps> {

  static defaultProps = {
    category: null,
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
      render: (text: string, record: any) => <Link to={`/categories/${record._id}`}>{text}</Link>
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
      if (newProps.category) {
        newState.modalVisible = false
        newState.editing = null
        newProps.loadCategories()
      }

      // We got data deleted?
      if (newProps.deletedId) {
        newProps.loadCategories()
      }
    }

    return newState
  }

  componentDidMount() {
    this.props.loadCategories()
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
    this.props.deleteCategory(entity._id)
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
    const { loading, categories, updateCategory } = this.props
    const { modalVisible, editing } = this.state

    return (
      <>
        <Table loading={loading} rowKey='_id' columns={this.tableColumns} dataSource={categories} />

        <Modal
          title='Category'
          visible={modalVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          { 
            modalVisible ? (
              <Category
                data={editing}
                onUpdate={(values: any) => this.handleSave(values, updateCategory)}
              />
            ) : null 
          }
        </Modal>
      </>
    )
  }
}
