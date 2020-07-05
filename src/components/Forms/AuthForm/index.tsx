import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Button, Typography, Card, Divider, Alert } from 'antd'
import { formLayout, tailLayout } from '..'
import { getErrorCode } from '../../../helpers/error-codes.helper'
import { FormConsumer } from '../../../context/FormContext'
import '../style.less'

type AuthFormProps = {
  onLogin: Function,
  onRegister: Function,
  activeTab: string,
  error: string | null,
  errorObjects: any,
  resetErrorsDispatch: Function,

  // Browser history
  history: any,
}

export default class AuthForm extends Component<AuthFormProps> {
  static defaultProps = {
    onLogin: () => {},
    onRegister: () => {},
    resetErrorsDispatch: () => {},
    activeTab: 'login',
    error: null
  }

  private tabList = [
    {
      key: 'login',
      tab: 'Login'
    },
    {
      key: 'register',
      tab: 'Register'
    }
  ]

  state = {
    activeTab: 'login'
  }

  constructor(props: any) {
    super(props)

    this.state = {
      ...this.state,
      activeTab: props.activeTab
    }
  }

  componentWillUnmount() {
    this.props.resetErrorsDispatch()
  }

  handleLoginSubmit = (values: any) => {
    this.props.onLogin(values)
  }

  handleRegisterSubmit = (values: any) => {
    this.props.onRegister(values)
  }

  handleTabChange = (tab: string) => {
    this.props.history.push(`/${tab}`)
  }

  renderLoginForm = () => {
    const { error } = this.props

    return (
      <FormConsumer>
        {({ form, onFormChange }: any) => {
          const values = form.login || {}

          return (
            <>
              {
                error ? (
                  <>
                    <Alert type="error" message={getErrorCode(error)} />
                    <Divider />
                  </>
                ) : null
              }

              <Form
                {...formLayout}
                name="login"
                hideRequiredMark={true}
                initialValues={values}
                onFinish={this.handleLoginSubmit}
                onChange={onFormChange}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      type: 'email',
                      message: 'This is not a valid Email'
                    },
                    {
                      required: true,
                      message: 'Please input your email'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{
                    required: true,
                    message: 'Please input your password'
                  }]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </>
          )
        }}
      </FormConsumer>
    )
  }

  renderRegisterForm = () => {
    const { error, errorObjects } = this.props

    return (
      <FormConsumer>
        {({ form, onFormChange }: any) => {
          const values = form.register || {}

          return (
            <>
              {
                error ? (
                  <>
                    <Alert type="error" message={getErrorCode(error, errorObjects)} />
                    <Divider />
                  </>
                ) : null
              }


              <Form
                {...formLayout}
                name="register"
                initialValues={values}
                onFinish={this.handleRegisterSubmit}
                onChange={onFormChange}
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{
                    required: true,
                    message: 'Please input your name'
                  }]}
                >
                  <Input />
                </Form.Item>
        
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      type: 'email',
                      message: 'This is not a valid Email'
                    },
                    {
                      required: true,
                      message: 'Please input your email'
                    }
                  ]}
                >
                  <Input type="email" />
                </Form.Item>
        
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{
                    required: true,
                    message: 'Please input your password'
                  }]}
                >
                  <Input.Password />
                </Form.Item>
        
                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </>
          )
        }}
      </FormConsumer>
    )
  }

  render() {
    const { activeTab } = this.state

    const contentList: any = {
      login: this.renderLoginForm(),
      register: this.renderRegisterForm()
    }

    return (
      <div className="auth-container">
        <div className="side-landing">
          <Typography.Title type="secondary">Authentication</Typography.Title>
          <Typography.Text type="secondary">Before you proceed, you must authenticate first.</Typography.Text>
          
          <div>
            {
              activeTab === 'login' ? (
                <>
                  <Typography.Text type="secondary">Don't have an account yet? </Typography.Text>
                  <Link to="/register" style={{fontWeight: 'bolder', color: '#fff'}}>Create an account</Link>
                </>
              ) : (
                <>
                  <Typography.Text type="secondary">Already have an account? </Typography.Text>
                  <Link to="/login" style={{fontWeight: 'bolder', color: '#fff'}}>Log in</Link>
                </>
              )
            }
          </div>
        </div>

        <div className="content">
          <Card
            title="Authentication"
            tabList={this.tabList}
            activeTabKey={activeTab}
            onTabChange={this.handleTabChange}
          >
            {contentList[activeTab]}
          </Card>
        </div>
      </div>
    )
  }
}
