import React, { Component } from 'react'
import { Card, Button, PageHeader, Row, Col } from 'antd'
import CategoryList from '../../components/CategoryList'
import CategoryDetail from '../../components/CategoryDetail'
import { Category as CategoryForm } from '../../components/Forms'
import { CategoryProvider, CategoryConsumer } from '../../context/CategoryContext'

export default class Category extends Component {

  renderAdd = () => {
    const { history }: any = this.props

    return (
      <Button type="primary" shape="round" onClick={() => history.push('/categories/add')}>
        Add
      </Button>
    )
  }

  renderCategoryForm = (dispatch: Function, newEntity: any = null) => {
    const { history }: any = this.props

    // Looks like we have received our new entity :P
    if (newEntity) {
      history.goBack()
    }

    return (
      <PageHeader title='New Category' subTitle='Creating a new category' onBack={() => history.goBack()}>
        <Row>
          <Col span={12} offset={6}>
            <CategoryForm onCreate={dispatch} />
          </Col>
        </Row>
      </PageHeader>
    )
  }

  render() {
    const { history, match: { params: { categoryId } } }: any = this.props

    return (
      <CategoryProvider>
        <CategoryConsumer>
          {({ fetching, categories, category, deletedId, requestCategoryDetail, requestCategoryList, requestCategoryUpdate, requestCategoryCreate, requestCategoryDelete }) => {
            // Show detail of a category
            if (categoryId && categoryId !== 'add') {
              return <CategoryDetail categoryId={categoryId} history={history} loadCategory={requestCategoryDetail} />
            }

            // Create a new category
            if (categoryId && categoryId === 'add') {
              return this.renderCategoryForm(requestCategoryCreate, category)
            }

            return (
              <Card title='Categories' extra={this.renderAdd()}>
                <CategoryList
                  loading={fetching}
                  categories={categories || []}
                  category={category}
                  deletedId={deletedId}
                  loadCategories={requestCategoryList}
                  updateCategory={requestCategoryUpdate}
                  deleteCategory={requestCategoryDelete}
                />
              </Card>
            )
          }}
        </CategoryConsumer>
      </CategoryProvider>
    )
  }
}
