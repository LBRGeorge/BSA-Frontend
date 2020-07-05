import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Auth } from '../../components/Forms'
import { FormProvider } from '../../context/FormContext'
import { AuthConsumer } from '../../context/AuthContext'

export default class AuthPage extends Component {
  render() {
    return (
      <FormProvider>
        <AuthConsumer>
          {({ loggedIn, error, errorObjects, requestLogin, requestRegister, resetErrors }) => {
            return (
              <>
                <Route path="/login" exact render={(props) => <Auth {...props} activeTab="login" error={error} errorObjects={errorObjects} resetErrorsDispatch={resetErrors} onLogin={requestLogin} />} />
                <Route path="/register" exact render={(props) => <Auth {...props} activeTab="register" error={error} errorObjects={errorObjects} resetErrorsDispatch={resetErrors} onRegister={requestRegister} />}/>

                {
                  // If we are logged in, we should not be here, so we go to home :P
                  loggedIn ? <Redirect to="/" /> : null
                }
              </>
            )
          }}
        </AuthConsumer>
      </FormProvider>
    )
  }
}
