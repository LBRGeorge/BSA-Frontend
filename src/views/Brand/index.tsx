import React, { Component } from 'react'
import { Card, Button, PageHeader, Row, Col } from 'antd'
import BrandList from '../../components/BrandList'
import BrandDetail from '../../components/BrandDetail'
import { Brand as BrandForm } from '../../components/Forms'
import { BrandProvider, BrandConsumer } from '../../context/BrandContext'

export default class Brand extends Component {

  renderAdd = () => {
    const { history }: any = this.props

    return (
      <Button type="primary" shape="round" onClick={() => history.push('/brands/add')}>
        Add
      </Button>
    )
  }

  renderBrandForm = (dispatch: Function, newEntity: any = null) => {
    const { history }: any = this.props

    // Looks like we have received our new entity :P
    if (newEntity) {
      history.goBack()
    }

    return (
      <PageHeader title='New Brand' subTitle='Creating a new brand' onBack={() => history.goBack()}>
        <Row>
          <Col span={12} offset={6}>
            <BrandForm onCreate={dispatch} />
          </Col>
        </Row>
      </PageHeader>
    )
  }

  render() {
    const { history, match: { params: { brandId } } }: any = this.props

    return (
      <BrandProvider>
        <BrandConsumer>
          {({ fetching, brands, brand, deletedId, requestBrandDetail, requestBrandList, requestBrandUpdate, requestBrandCreate, requestBrandDelete }) => {
             // Show detail of a brand
             if (brandId && brandId !== 'add') {
              return <BrandDetail brandId={brandId} history={history} loadBrand={requestBrandDetail} />
            }

            // Create a new brand
            if (brandId && brandId === 'add') {
              return this.renderBrandForm(requestBrandCreate, brand)
            }

            return (
              <Card title='Brands' extra={this.renderAdd()}>
                <BrandList
                  loading={fetching}
                  brands={brands || []}
                  brand={brand}
                  deletedId={deletedId}
                  loadBrands={requestBrandList}
                  updateBrand={requestBrandUpdate}
                  deleteBrand={requestBrandDelete}
                />
              </Card>
            )
          }}
        </BrandConsumer>
      </BrandProvider>
    )
  }
}
