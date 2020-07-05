import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, Card, Row, Col, Typography, Skeleton } from 'antd'
import { DashboardProvider, DashboardConsumer } from '../../context/DashboardContext'
import './style.less'

export default class Home extends Component {

  render() {
    return (
      <DashboardProvider>
        <DashboardConsumer>
          {({ fetching, error, stats, requestDashboardStats }) => {
            // Fetch new data
            if (!fetching && !error && !stats) {
              // Avoid React complains about calling method just after rendering
              setTimeout(() => {
                requestDashboardStats()
              }, 1000)
            }

            // Loading
            if (fetching) {
              return <Skeleton />
            }

            return (
              <PageHeader title='BSA - Dashboard' subTitle='Just that simple :D'>
                <Row gutter={16}>
                  <Col className='gutter-row' flex={2}>
                    <Card title='Products' bordered={true} extra={<Link to='/products'>More</Link>}>
                    <Typography.Title>{stats?.productsTotal}</Typography.Title>
                    </Card>
                  </Col>

                  <Col className='gutter-row' flex={2}>
                    <Card title='Categories' bordered={true} extra={<Link to='/categories'>More</Link>}>
                      <Typography.Title>{stats?.categoriesTotal}</Typography.Title>
                    </Card>
                  </Col>

                  <Col className='gutter-row' flex={2}>
                    <Card title='Brands' bordered={true} extra={<Link to='/brands'>More</Link>}>
                      <Typography.Title>{stats?.brandsTotal}</Typography.Title>
                    </Card>
                  </Col>
                </Row>
              </PageHeader>
            )
          }}
        </DashboardConsumer>
      </DashboardProvider>
    )
  }
}
