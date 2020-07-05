import React, { Component } from 'react'
import { PageHeader, Skeleton, Result } from 'antd'
import ProductList from '../ProductList'
import { BrandConsumer } from '../../context/BrandContext'

type BrandDetailProps = {
  brandId: string
  loadBrand: Function
  history: any
}

export default class BrandDetail extends Component<BrandDetailProps> {

  componentDidMount() {
    const { brandId, loadBrand } = this.props

    // Load brand detail
    if (brandId) {
      loadBrand(brandId)
    }
  }

  handleBackButton = () => {
    this.props.history.goBack()
  }

  render() {
    return (
      <BrandConsumer>
        {({ fetching, brand }) => {
          if (fetching) {
            return <Skeleton />
          }

          if (!brand) {
            return <Result
              status="404"
              title="404"
              subTitle="Sorry, the brand you requested, does not exist."
            />
          }

          return (
            <PageHeader title={brand.name} subTitle={brand.description} onBack={this.handleBackButton}>
              <ProductList products={brand.products} />
            </PageHeader>
          )
        }}
      </BrandConsumer>
    )
  }
}
