import React, { Component } from 'react'
import { Card, Button, PageHeader, Row, Col } from 'antd'
import ProductList from '../../components/ProductList'
import ProductDetail from '../../components/ProductDetail'
import { Product as ProductForm } from '../../components/Forms'
import { ProductProvider, ProductConsumer } from '../../context/ProductContext'
import { CategoryProvider, CategoryConsumer } from '../../context/CategoryContext'
import { BrandProvider, BrandConsumer } from '../../context/BrandContext'


export default class Product extends Component {

  renderAdd = () => {
    const { history }: any = this.props

    return (
      <Button type="primary" shape="round" onClick={() => history.push('/products/add')}>
        Add
      </Button>
    )
  }

  renderProductForm = (dispatch: Function, newEntity: any = null) => {
    const { history }: any = this.props

    // Looks like we have received our new entity :P
    if (newEntity) {
      history.goBack()
    }

    return (
      <CategoryProvider>
        <BrandProvider>
          <CategoryConsumer>
            {({ requestCategoryList }) => (
              <BrandConsumer>
                {({ requestBrandList }) => (
                  <PageHeader title='New Product' subTitle='Creating a new product' onBack={() => history.goBack()}>
                  <Row>
                    <Col span={12} offset={6}>
                      <ProductForm
                        loadCategories={requestCategoryList}
                        loadBrands={requestBrandList}
                        onCreate={dispatch}
                      />
                    </Col>
                  </Row>
                </PageHeader>
                )}
              </BrandConsumer>
            )}
          </CategoryConsumer>
          
        </BrandProvider>
      </CategoryProvider>
    )
  }

  render() {
    const { history, match: { params: { productId } } }: any = this.props

    return (
      <ProductProvider>
        <ProductConsumer>
          {({ fetching, products, product, deletedId, pagination, requestProductList, requestProductDetail, requestProductCreate, requestProductUpdate, requestProductDelete }) => {
            // Show detail of a category
            if (productId && productId !== 'add') {
              return <ProductDetail productId={productId} history={history} loadProduct={requestProductDetail} />
            }

            // Create a new category
            if (productId && productId === 'add') {
              return this.renderProductForm(requestProductCreate, product)
            }

            return (
              <CategoryProvider>
                <CategoryConsumer>
                  {({ categories, requestCategoryList }) => (
                    <Card title='Products' extra={this.renderAdd()}>
                      <ProductList
                        loading={fetching}
                        products={products || []}
                        product={product}
                        deletedId={deletedId}
                        pagination={pagination}
                        categories={categories}
                        loadCategories={requestCategoryList}
                        loadProducts={requestProductList}
                        updateProduct={requestProductUpdate}
                        deleteProduct={requestProductDelete}
                      />
                    </Card>
                  )}
                </CategoryConsumer>
              </CategoryProvider>
            )
          }}
        </ProductConsumer>
      </ProductProvider>
    )
  }
}
