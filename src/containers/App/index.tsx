import React, { Component } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import AppTemplate from '../../components/Template/AppTemplate'
import { AuthProvider, AuthConsumer } from '../../context/AuthContext'
import NavRoutes from '../../navigation'

// Define component type
type AppType = RouteComponentProps

class App extends Component<AppType> {
  render() {
    return (
      <AuthProvider>
        <Switch>
          {
            NavRoutes.filter(p => !p.isPrivate).map((route, index) => {
              const { path, name, exact, component } = route

              return <Route key={`route-${index}`} path={path} name={name} exact={exact} component={component} />
            })
          }

          <AuthConsumer>
            {({ loggedIn, requestLogout }) => {
              if (loggedIn) return <AppTemplate {...this.props} signOut={requestLogout} />

              return <Redirect from='/' to='/login' exact />
            }}
          </AuthConsumer>
        </Switch>
      </AuthProvider>
    )
  }
}

export default withRouter(App)
