// @ts-nocheck
import React, { useState, useRef } from 'react';
import IconsModal from './IconsModal';
import {
  Field,
  Flex,
} from '@strapi/design-system';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Cross, Search } from '@strapi/icons';

import getTrad from '../../utils/getTrad';
import styled from "styled-components"

const IconWrapper = styled.div`
  height: 1rem;
  width: 1rem;
  color: ${({ theme }) => theme.colors.neutral900};
  display: flex;
  align-items: center;
`

const IconPickerField = ({
  description,
  disabled,
  error,
  intlLabel,
  labelAction,
  name,
  onChange,
  required,
  value,
}) => {
  const { formatMessage } = useIntl();
  const searchbarRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(() => {
    try {
      const icon = JSON.parse(value);
      return icon;
    } catch (error) {
      return null;
    }
  });

  function openModal() {
    setShowModal(true);
    setTimeout(() => {
      searchbarRef.current.focus();
     }, 0)
  }

  return (
    <Field
      name={name}
      id={name}
      // GenericInput calls formatMessage and returns a string for the error
      error={error}
      hint={description && formatMessage(description)}
      required={required}
    >
      <Flex direction="column" alignItems="stretch" gap={1}>
        <Field.Label action={labelAction}>{formatMessage(intlLabel)}</Field.Label>
        <Field.Input
          type="text"
          id="icon-picker-value"
          value={selectedIcon?.name ?? ''}
          placeholder="Select an icon"
          onChange={openModal}
          onClick={openModal}
          disabled={disabled}
          startAction={
            <Field.Action
              onClick={openModal}
              label="open icon picker"
            >
              {selectedIcon ? (
                <IconWrapper dangerouslySetInnerHTML={{ __html: selectedIcon.component }} />
              ) : (
                <Search
                  fill={theme.colors.neutral500}
                  height="0.85rem"
                />
              )}
            </Field.Action>
          }
          endAction={
            selectedIcon && (
              <Field.Action
                onClick={() => {
                  setSelectedIcon(null)
                  onChange({
                    target: {
                      name,
                      type: 'string',
                      value: '',
                    },
                  });
                }}
                label="reset icon picker"
              >
                <Cross
                  fill={theme.colors.neutral500}
                  height="0.85rem"
                />
              </Field.Action>
            )
          }
          aria-label={formatMessage({
            id: getTrad('icon-picker.toggle.aria-label'),
            defaultMessage: 'Icon picker toggle',
          })}
          aria-controls="icon-picker-value"
          aria-haspopup="dialog"
          aria-expanded={showModal}
        />
        {showModal && (
          <IconsModal
            closeModal={() => setShowModal(false)}
            setSelectedIcon={setSelectedIcon}
            onChange={onChange}
            name={name}
            searchbarRef={searchbarRef}
          />
        )}
        <Field.Hint />
        <Field.Error />
      </Flex>
    </Field>
  );
};

IconPickerField.defaultProps = {
  description: null,
  disabled: false,
  error: null,
  labelAction: null,
  required: false,
  value: '',
};

IconPickerField.propTypes = {
  intlLabel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  labelAction: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.string,
};

export default IconPickerField;
