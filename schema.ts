import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { password, text, timestamp, select, relationship } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
//import { sendWelcomeEmail } from './lib/welcomeEmail';

export const lists = {
  Post: list({
    access: allowAll,
    fields: {
      title: text(),
      publishedAt: timestamp(),
      author: relationship({
        ref: 'Author.posts',
      }),
      content: document({
        formatting: true,
        links: true,
        dividers: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
      }),
      status: select({
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
        ],
        defaultValue: 'draft',
        ui: { displayMode: 'segmented-control' },
      }),
    },
    hooks: {
      validateInput: ({ resolvedData, addValidationError }) => {
        const { title } = resolvedData;
        if (title === '') {
          // We call addValidationError to indicate an invalid value.
          addValidationError('The title of a blog post cannot be the empty string');
        }
      },
      resolveInput: ({ resolvedData }) => {
        const { title } = resolvedData;
        console.log(title);

        if (title) {
          return {
            ...resolvedData,
            title: title[0].toUpperCase() + title.slice(1)
          }
        }
        return resolvedData;
      }
    },
  }),
  Author: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      posts: relationship({ ref: 'Post.author', many: true }),
      password: password({ validation: { isRequired: true } })
    },
    hooks: {
      afterOperation: ({ operation, item }) => {
        if (operation === 'create') {
        //  sendWelcomeEmail(item.name, item.email);
          console.log(`New user created. Name: ${item.name}, Email: ${item.email}`);
        } else if (operation === 'delete') {
          console.log(`user deleted.`);
        } else if (operation === 'update') {
          console.log(`user updated ${item.name}, Email: ${item.email}`);
        }
      },
    },
  }),
};


// import { list } from '@keystone-6/core';
// import { allowAll } from '@keystone-6/core/access';
// import { select, password, relationship, text, timestamp } from '@keystone-6/core/fields';

// export const lists = {
//   Post: list({
//     access: allowAll,
//     ui: {
//       searchFields: ['title', 'content'],
//     },
//     fields: {
//       title: text({ validation: { isRequired: true } }),
//       status: select({
//         type: 'enum',
//         options: [
//           { label: 'Draft', value: 'draft' },
//           { label: 'Published', value: 'published' },
//         ],
//       }),
//       content: text(),
//       publishDate: timestamp(),
//       author: relationship({ ref: 'Author.posts', many: false }),
//     },
//     hooks: {
//             validateInput: ({ resolvedData, addValidationError }) => {
//               const { title } = resolvedData;
//               if (title === '') {
//                 // We call addValidationError to indicate an invalid value.
//                 addValidationError('The title of a blog post cannot be the empty string');
//               }
//             },
//             resolveInput: ({ resolvedData }) => {
//               const { title } = resolvedData;
//               console.log(title);
      
//               if (title) {
//                 return {
//                   ...resolvedData,
//                   title: title[0].toUpperCase() + title.slice(1)
//                 }
//               }
//               return resolvedData;
//             }
//           },
//   }),
//   Author: list({
//     access: allowAll,
//     fields: {
//       name: text({ validation: { isRequired: true } }),
//       email: text({ isIndexed: 'unique', validation: { isRequired: true } }),
//       posts: relationship({ ref: 'Post.author', many: true }),
//      // password: password({ validation: { isRequired: true } })
//     },
//     hooks: {
//             afterOperation: ({ operation, item }) => {
//               if (operation === 'create') {
//               //  sendWelcomeEmail(item.name, item.email);
//                 console.log(`New user created. Name: ${item.name}, Email: ${item.email}`);
//               } else if (operation === 'delete') {
//                 console.log(`New user deleted.`);
//               } else if (operation === 'update') {
//                 console.log(`user updated ${item.name}, Email: ${item.email}`);
//               }
//             },
//           },
//   }),
// };