import React, { Component } from 'react'
import { PageHeader, Skeleton, Result, Row, Col, Statistic, Typography, Divider } from 'antd'
import { ProductConsumer } from '../../context/ProductContext'

type ProductDetailProps = {
  productId: string
  loadProduct: Function
  history: any
}

export default class ProductDetail extends Component<ProductDetailProps> {

  componentDidMount() {
    const { productId, loadProduct } = this.props

    // Load product detail
    if (productId) {
      loadProduct(productId)
    }
  }

  handleBackButton = () => {
    this.props.history.goBack()
  }

  render() {
    return (
      <ProductConsumer>
        {({ fetching, product }) => {
          if (fetching) {
            return <Skeleton />
          }

          if (!product) {
            return <Result
              status="404"
              title="404"
              subTitle="Sorry, the product you requested, does not exist."
            />
          }

          return (
            <PageHeader title={product.name} onBack={this.handleBackButton}>
              <Row>
                <Col xs={24} md={6}>
                  <Statistic title='Category' value={product.category.name} />
                </Col>

                <Col xs={24} md={6}>
                  <Statistic title='Brand' value={product.brand.name} />
                </Col>

                <Col xs={24} md={6}>
                  <Statistic
                    title='Price'
                    prefix='$'
                    value={Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price as number).replace('$', '')}
                  />
                </Col>

                <Col xs={24} md={6}>
                  <Statistic title='Quantity' value={product.quantity.toString()} />
                </Col>
              </Row>

              <Row style={{marginTop: 30}}>
                <Typography.Title style={{fontSize: 18}}>Description</Typography.Title>
                <Divider style={{marginTop: 5}} />
                <Typography.Text>{product.description}</Typography.Text>
              </Row>
            </PageHeader>
          )
        }}
      </ProductConsumer>
    )
  }
}
