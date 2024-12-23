import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });

    app.customFields.register({
      name: "icon-picker",
      pluginId: pluginId,
      type: "string", // the icon will be stored JSON object stringified
      intlLabel: {
        id: "heroicons-field.icon-picker.label",
        defaultMessage: "Icon",
      },
      intlDescription: {
        id: "heroicons-field.icon-picker.description",
        defaultMessage: "Select a heroicon",
      },
      icon: PluginIcon,
      components: {
        Input: async () => import(/* webpackChunkName: "input-component" */ "./components/IconPickerField"),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'heroicons-field.options.advanced.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'heroicons-field.options.advanced.requiredField.description',
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });
  },

  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
