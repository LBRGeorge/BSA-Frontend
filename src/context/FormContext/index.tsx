import React, { Component, createContext } from 'react'
import { onFormChange as formFields } from '../../helpers/form-fields.helper'

// Whole context data
interface FormContextData {
  form: any,
  
  resetFields: Function
  onFormChange: any
}

// Create context
const { Provider, Consumer } = createContext({} as FormContextData)

export const FormConsumer = Consumer

export class FormProvider extends Component {
  state = {
    form: {}
  }

  /**
   * Reset fields of form
   * 
   * @param form 
   */
  resetFields = (form: string) => {
    this.setState((state: any) => ({
      ...state,
      form: {
        ...state.form,
        [form]: {}
      }
    }))
  }

  /**
   * Event for form change
   * 
   * @param ev 
   */
  onFormChange = (ev: any) => {
    const { form, input } = formFields(ev)

    this.setState((state: any) => ({
      ...state,
      form: {
        ...state.form,
        [form]: {
          ...state.form[form],
          [input.name]: input.value
        }
      }
    }))
  }

  render() {
    const { form } = this.state

    return (
      <Provider value={{
        form,
        
        resetFields: this.resetFields,
        onFormChange: this.onFormChange
      }}>
        {this.props.children}
      </Provider>
    )
  }
}
