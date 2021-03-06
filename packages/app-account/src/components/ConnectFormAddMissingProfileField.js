import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { Button, FormControl, Table } from 'react-bootstrap'
import { IconButton } from 'interbit-ui-components'

import formNames from '../constants/formNames'

// eslint-disable-next-line
const renderInput = ({onChange, props, placeholder, type, input, meta: {touched, error, warning}}) => (
  <div className={touched && error ? 'field-error' : ''}>
    <FormControl placeholder={placeholder} type={type} {...input} />
    {touched &&
      ((error && <span className="error-msg">{error}</span>) ||
        (warning && <span>{warning}</span>))}
  </div>
)

// TODO: move this to a common validation file
const required = value => (value ? undefined : 'This field is required.')

const email = value =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? undefined
    : 'Invalid email address.'

export class ConnectFormAddMissingProfileField extends Component {
  static propTypes = {
    image: PropTypes.string,
    imageAlt: PropTypes.string,
    isEditable: PropTypes.bool,
    missingFields: PropTypes.arrayOf(PropTypes.string),
    onCancel: PropTypes.func,
    profileFields: PropTypes.shape({}),
    handleSubmit: PropTypes.func.isRequired,
    title: PropTypes.string,
    toggleForm: PropTypes.func.isRequired,
    valid: PropTypes.bool.isRequired
  }

  static defaultProps = {
    image: '',
    imageAlt: '',
    isEditable: false,
    missingFields: [],
    onCancel: undefined,
    profileFields: {},
    title: ''
  }

  render() {
    const {
      image,
      imageAlt,
      isEditable,
      missingFields,
      onCancel,
      profileFields,
      handleSubmit,
      title,
      toggleForm,
      valid
    } = this.props

    const viewForm = (
      <div>
        <Table>
          <tbody>
            {Object.keys(profileFields).map(key => (
              <tr key={key}>
                <td>{key}</td>
                <td>{profileFields[key]}</td>
              </tr>
            ))}
            {missingFields.map(field => (
              <tr key={field}>
                <td colSpan={2}>
                  <Button
                    className="text-button"
                    onClick={() => {
                      toggleForm(formNames.CAUTH_ADD_REQUESTED_TOKENS)
                    }}>
                    Add {field}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="btn-container">
          <IconButton text="Continue" className="disabled" />
          <IconButton
            text="Go Back"
            className="secondary"
            clickHandler={() => onCancel()}
          />
        </div>
      </div>
    )

    const editForm = (
      <form onSubmit={handleSubmit}>
        <Table>
          <tbody>
            {Object.keys(profileFields).map(key => (
              <tr key={`${key}-value`}>
                <td>{key}</td>
                <td>
                  {profileFields[key]}
                  <Field component={renderInput} name={key} type="hidden" />
                </td>
              </tr>
            ))}
            {missingFields.map(field => (
              <tr key={field}>
                <td colSpan={2} className="form-td">
                  <Field
                    component={renderInput}
                    name={field}
                    placeholder={`Add ${field}`}
                    type={field === 'email' ? 'email' : 'text'}
                    validate={
                      field === 'email' ? [required, email] : [required]
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <p>
          These field(s) will be added to your Interbit identity and can be used
          in other apps that require them.
        </p>
        <div className="btn-container">
          <IconButton
            text="Save"
            type="submit"
            className={`ibweb-button ${!valid && `disabled`}`}
            clickHandler={() => handleSubmit()}
          />
          <IconButton
            text="Cancel"
            className="secondary"
            clickHandler={() => {
              toggleForm(formNames.CAUTH_ADD_REQUESTED_TOKENS)
            }}
          />
        </div>
      </form>
    )

    return (
      <div>
        {image && <img src={image} alt={imageAlt} />}
        <h3>{title}</h3>

        {isEditable ? editForm : viewForm}
      </div>
    )
  }
}

export default reduxForm({
  form: formNames.CAUTH_ADD_REQUESTED_TOKENS
})(ConnectFormAddMissingProfileField)
