import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { formLayout, tailLayout } from '..'
import { FormProvider, FormConsumer } from '../../../context/FormContext'

type BrandFormProps = {
  data: any
  loading: boolean

  onUpdate: Function
  onCreate: Function
}

export default class BrandForm extends Component<BrandFormProps> {

  static defaultProps = {
    data: {},
    loading: false,

    onUpdate: () => {},
    onCreate: () => {}
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

  render() {
    const { loading } = this.props

    return (
      <FormProvider>
        <FormConsumer>
          {({ form, onFormChange }) => {
            const values = form.brand || this.props.data

            return (
              <Form
                {...formLayout}
                name="brand"
                initialValues={values}
                onFinish={this.handleSave}
                onChange={onFormChange}
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{
                    required: true,
                    message: 'Please input the brand name'
                  }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                >
                  <Input />
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
