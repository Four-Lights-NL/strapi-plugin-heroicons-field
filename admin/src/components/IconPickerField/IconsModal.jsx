// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import {
  Button,
  SingleSelect,
  SingleSelectOption,
  SearchForm,
  Searchbar,
  Typography,
  Modal,
} from '@strapi/design-system';
import * as miniIcons from '@heroicons/react/20/solid';
import * as outlineIcons from '@heroicons/react/24/outline';
import * as solidIcons from '@heroicons/react/24/solid';
import styled from 'styled-components';

const IconWrapper = styled.button`
  margin: ${({ theme }) => theme.spaces[2]};
  color: ${({ theme }) => theme.colors.neutral900};
  display: inline-block;
`;

const IconsModal = ({ closeModal, setSelectedIcon, name, onChange, searchbarRef }) => {
  const [selectedIconLibrary, setSelectedIconLibrary] = useState('outline');
  const [query, setQuery] = useState('');
  const [filteredIcons, setFilteredIcons] = useState([]);
  const iconsLib = {
    outline: outlineIcons,
    solid: solidIcons,
    mini: miniIcons,
  };

  // search logic
  useEffect(() => {
    const icons = Object.entries(iconsLib[selectedIconLibrary]);
    if (!query) return setFilteredIcons(icons);

    const filtered = icons.filter(([iconName]) =>
      iconName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredIcons(filtered);
  }, [query, selectedIconLibrary]);

  return (
    <Modal.Content onClose={closeModal} labelledBy="title">
      <Modal.Header>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Select an icon
        </Typography>
      </Modal.Header>
      <Modal.Body>
        <SearchForm style={{ marginBottom: '1rem' }}>
          <Searchbar
            name="searchbar"
            onClear={() => setQuery('')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            clearLabel="Clearing the search"
            placeholder="Search by icon name"
            ref={searchbarRef}
          >
            Searching for an icon
          </Searchbar>
        </SearchForm>

        {filteredIcons.map(([iconName, Icon]) => (
          <IconWrapper
            key={iconName}
            onClick={() => {
              setSelectedIcon({
                name: iconName,
                component: renderToString(<Icon />),
              });
              onChange({
                target: {
                  name,
                  type: 'string',
                  value: JSON.stringify({
                    name: iconName,
                    component: renderToString(<Icon />),
                  }),
                },
              });
              closeModal();
            }}
          >
            <Icon
              title={iconName}
              height={selectedIconLibrary === 'mini' ? '20px' : '24px'}
            />
          </IconWrapper>
        ))}
      </Modal.Body>
      <Modal.Footer
        startActions={
          <SingleSelect
            minWidth={600}
            required={0}
            value={selectedIconLibrary}
            onChange={setSelectedIconLibrary}
          >
            <SingleSelectOption value="outline">Outline</SingleSelectOption>
            <SingleSelectOption value="solid">Solid</SingleSelectOption>
            <SingleSelectOption value="mini">Mini</SingleSelectOption>
          </SingleSelect>
        }
        endActions={
          <>
            <Button onClick={closeModal}>Finish</Button>
          </>
        }
      />
    </Modal.Content>
  );
};

export default IconsModal;
