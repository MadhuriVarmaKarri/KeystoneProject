import { config } from '@keystone-6/core';
import { withAuth, session } from './auth';
import { lists } from './schema';
import { insertSeedData } from './seed-data';
import { Context } from '.keystone/types';


export default config(
  withAuth({
    db: {
      provider: 'sqlite',
      url: process.env.DATABASE_URL || 'file:./keystone-example.db',
      async onConnect(context: Context) {
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(context);
        }
      },
    },
    lists,
    session,
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
  })
);

// import { config } from '@keystone-6/core';
// import { lists } from './schema';
// import { insertSeedData } from './seed-data';
// import { Context } from '.keystone/types';
// //import { withAuth, session } from './auth';

// export default config
// //withAuth
//  ({
//   db: {
//     provider: 'sqlite',
//     url: process.env.DATABASE_URL || 'file:./keystone-example.db',
//    //url: 'file:./keystone.db',
//     async onConnect(context: Context) {
//       if (process.argv.includes('--seed-data')) {
//         await insertSeedData(context);
//       }
//     },
//   },
//   lists,
//   // session,
//   //     ui: {
//   //       isAccessAllowed: (context) => !!context.session?.data,
//   //     },
// });