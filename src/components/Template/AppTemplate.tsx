import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { Layout, Menu, Typography } from 'antd'
import { AuthConsumer } from '../../context/AuthContext'
import NavRoutes, { MenuItems } from '../../navigation'
import './style.less'

type AppTemplateProps = {
  signOut: Function
}

const { Header, Content, Footer, Sider } = Layout

export default class AppTemplate extends Component<AppTemplateProps> {

  state = {
    sideMenuCollapsed: false
  }

  /**
   * Handle the side menu collapse
   * We need to know when the side menu is collapsed,
   * because we resize the length of the logo, then we do not break the layout
   */
  handleSideMenuCollapse = (collapsed: boolean) => {
    this.setState({
      sideMenuCollapsed: collapsed
    })
  }

  /**
   * Get active menu by route
   */
  getActiveMenu = () => {
    const { location: { pathname } }: any = this.props

    // Remove starting slash
    let path = pathname[0] === '/' ? pathname.slice(1, pathname.length) : pathname

    // If our path is empty, then we must be at home :P
    if (path.length === 0) return 0

    // Get only the first path
    if (path.indexOf('/') !== -1) {
      path = path.slice(0, path.indexOf('/'))
    }

    // Find index by path at our menu items
    const index = MenuItems.findIndex(item => item.path === `/${path}`)
    
    return index
  }

  renderSideMenu = () => {
    const { sideMenuCollapsed } = this.state
    const activeMenuIndex = this.getActiveMenu()

    return (
      <Sider collapsible breakpoint="lg" onCollapse={this.handleSideMenuCollapse}>
        <div className="logo">
          <Typography.Text>
            { sideMenuCollapsed ? 'BSA'  : 'BSA - Just that simple' }
          </Typography.Text>
        </div>

        <Menu theme="dark" mode="inline" defaultSelectedKeys={[`menu-item-${activeMenuIndex}`]}>
          {
            MenuItems.map((menu, index) => {
              const { path, name, icon } = menu

              return (
                <Menu.Item key={`menu-item-${index}`} icon={icon}>
                  <Link to={path}>
                    {name}
                  </Link>
                </Menu.Item>
              )
            })
          }
        </Menu>
      </Sider>
    )
  }

  render() {
    return (
      <AuthConsumer>
        {({ user }) => {
          const firstName = user?.name.split(' ')[0]

          return (
            <Layout>
              {
                // Render responsive side menu
                this.renderSideMenu()
              }

              <Layout>
                <Header className="site-layout-sub-header-background">
                  <Menu theme="dark" mode="horizontal">
                    <Menu.Item key="1">
                      <Typography.Text type="secondary" strong>
                        Welcome back, {firstName}!
                      </Typography.Text>
                    </Menu.Item>
                    <Menu.Item key="2" style={{float: 'right'}} onClick={() => this.props.signOut()}>GET ME OUT HERE</Menu.Item>
                  </Menu>
                </Header>

                <Content style={{ margin: '24px 16px 0' }}>
                  <div className="site-layout-background" style={{ padding: 24, minHeight: '80vh' }}>
                    {
                      NavRoutes.filter(p => p.isPrivate).map((route, index) => {
                        const { path, name, exact, component } = route

                        return <Route key={`app-route-${index}`} path={path} name={name} exact={exact} component={component} />
                      })
                    }
                  </div>
                </Content>

                <Footer style={{ textAlign: 'center' }}>BSA - Frontend, that's all folks!</Footer>
              </Layout>
            </Layout>
          )
        }}
      </AuthConsumer>
    )
  }
}
