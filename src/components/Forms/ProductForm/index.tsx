import React, { Component } from 'react'
import { Form, Input, InputNumber, Select, Button } from 'antd'
import { formLayout, tailLayout } from '..'
import { FormProvider, FormConsumer } from '../../../context/FormContext'
import { CategoryConsumer } from '../../../context/CategoryContext'
import { BrandConsumer } from '../../../context/BrandContext'

type ProductFormProps = {
  data: any
  loading: boolean
  
  loadCategories: Function
  loadBrands: Function

  onUpdate: Function
  onCreate: Function
}

export default class ProductForm extends Component<ProductFormProps> {

  static defaultProps = {
    data: {},
    loading: false,

    loadCategories: () => {},
    loadBrands: () => {},

    onUpdate: () => {},
    onCreate: () => {}
  }

  componentDidMount() {
    this.props.loadCategories({ noPagination: true })
    this.props.loadBrands()
  }

  /**
   * Save values from form subimitting
   * 
   * @param values 
   */
  handleSave = (values: any) => {
    const { data, onUpdate, onCreate } = this.props

    if (Object.keys(data).length > 0) {
      onUpdate({
        ...values,
        id: data._id
      })
    } else {
      onCreate(values)
    }
  }

  renderCategories = () => {
    return (
      <CategoryConsumer>
        {({ fetching, categories }) => {
          let options: any = []
          if (categories) {
            options = categories.map((category: any) => {
              return {
                label: category.name,
                value: category._id
              }
            })
          }

          return (
            <Form.Item
              label="Category"
              name="category"
              rules={[{
                required: true,
                message: 'Please select a category'
              }]}
            >
              <Select
                placeholder='Select a category'
                options={options}
                loading={fetching}
              />
            </Form.Item>
          )
        }}
      </CategoryConsumer>
    )
  }

  renderBrands = () => {
    return (
      <BrandConsumer>
        {({ fetching, brands }) => {
          let options: any = []
          if (brands) {
            options = brands.map((brand: any) => {
              return {
                label: brand.name,
                value: brand._id
              }
            })
          }

          return (
            <Form.Item
              label="Brand"
              name="brand"
              rules={[{
                required: true,
                message: 'Please select a brand'
              }]}
            >
              <Select
                placeholder='Select a brand'
                options={options}
                loading={fetching}
              />
            </Form.Item>
          )
        }}
      </BrandConsumer>
    )
  }

  render() {
    const { loading } = this.props

    return (
      <FormProvider>
        <FormConsumer>
          {({ form, onFormChange }) => {
            const values = form.product || this.props.data
            const selectedCategory = values['category'] ? values['category']._id : ''
            const selectedBrand = values['brand'] ? values['brand']._id : ''

            // Parse values
            if (selectedCategory && selectedCategory.length > 0) {
              values['category'] = selectedCategory
            }
            if (selectedBrand && selectedBrand.length > 0) {
              values['brand'] = selectedBrand
            }

            return (
              <Form
                {...formLayout}
                name="product"
                initialValues={values}
                onFinish={this.handleSave}
                onChange={onFormChange}
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{
                    required: true,
                    message: 'Please input the product name'
                  }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                >
                  <Input.TextArea rows={8} />
                </Form.Item>

                {this.renderCategories()}
                {this.renderBrands()}

                <Form.Item
                  label="Price"
                  name="price"
                  rules={[{
                    required: true,
                    message: 'Please input the product price'
                  }]}
                >
                  <InputNumber
                    formatter={(value: any) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>

                <Form.Item
                  label="Quantity"
                  name="quantity"
                  rules={[{
                    required: true,
                    message: 'Please input the product quantity'
                  }]}
                >
                  <InputNumber min={0} />
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit" loading={loading} style={{float: 'right'}}>
                    Save
                  </Button>
                </Form.Item>
              </Form>
            )
          }}
        </FormConsumer>
      </FormProvider>
    )
  }
}
