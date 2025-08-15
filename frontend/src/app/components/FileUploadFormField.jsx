
import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { FileUpload } from '../libs/era'
import {TextField } from '../libs/era'

function FileUploadFormField(props) {
  const { name, fields, onChange, ...otherProps } = props

  const {
    formState: { errors },
    setValue,
    watch
  } = useFormContext()

  const files = watch(name)

  const transformFields = useCallback(() => {
    if (!fields) return

    return fields.reduce((acc, curr) => {
      switch (curr.type) {
        case 'custom': {
          if (!curr.component) break

          acc.push({
            inputProps: { defaultValue: undefined },
            label: curr.label,
            name: curr.name,
            type: 'custom',
            component: curr.component
          })
          break
        }

        case 'select': {
          acc.push({
            label: curr.label,
            name: curr.name,
            type: 'custom',
            component: params =>
              renderSelectField(
                {
                  ...curr,
                  inputProps: { defaultValue: undefined, ...curr.inputProps }
                },
                params
              )
          })
          break
        }

        case 'textfield': {
          acc.push({
            label: curr.label,
            name: curr.name,
            type: 'custom',
            component: params =>
              renderTextField(
                {
                  ...curr,
                  inputProps: { defaultValue: undefined, ...curr.inputProps }
                },
                params
              )
          })
          break
        }

        default:
          break
      }

      return acc
    }, [])
  }, [fields])

  function onChangeHandler(changedFiles) {
    if (onChange) {
      onChange(changedFiles, name)
    }

    setValue(name, changedFiles?.[0]?.file || null, { shouldValidate: true })
  }

  return (
    <FileUpload
      fields={transformFields(fields)}
      files={files}
      name={name}
      error={!!errors?.[name]}
      errorMessage={errors?.[name]?.message}
      onChange={onChangeHandler}
      {...otherProps}
    />
  )
}

function renderSelectField(field, params) {
  return <TextField size='small' options={field.options} {...params} {...field.inputProps} />
}

function renderTextField(field, params) {
  return <TextField size='small' {...params} {...field.inputProps} />
}

export default FileUploadFormField
