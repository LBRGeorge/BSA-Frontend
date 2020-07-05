import React, { Component } from 'react'
import { PageHeader, Skeleton, Result } from 'antd'
import ProductList from '../ProductList'
import { CategoryConsumer } from '../../context/CategoryContext'

type CategoryDetailProps = {
  categoryId: string
  loadCategory: Function
  history: any
}

export default class CategoryDetail extends Component<CategoryDetailProps> {

  componentDidMount() {
    const { categoryId, loadCategory } = this.props

    // Load category detail
    if (categoryId) {
      loadCategory(categoryId)
    }
  }

  handleBackButton = () => {
    this.props.history.goBack()
  }

  render() {
    return (
      <CategoryConsumer>
        {({ fetching, category }) => {
          if (fetching) {
            return <Skeleton />
          }

          if (!category) {
            return <Result
              status="404"
              title="404"
              subTitle="Sorry, the category you requested, does not exist."
            />
          }

          return (
            <PageHeader title={category.name} subTitle={category.description} onBack={this.handleBackButton}>
              <ProductList products={category.products} />
            </PageHeader>
          )
        }}
      </CategoryConsumer>
    )
  }
}
