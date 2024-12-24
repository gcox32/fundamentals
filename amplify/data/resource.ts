import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  User: a
    .model({
      id: a.id(),
      sub: a.string(),
      profile: a.hasOne('Profile', 'userId'),
      portfolios: a.hasMany('Portfolio', 'userId'),
      watchlists: a.hasMany('Watchlist', 'userId'),
      pageSettings: a.hasOne('PageSettings', 'userId'),
    })
    .authorization((allow) => [allow.groups(['admin','member'])]),
  Profile: a
    .model({
      id: a.id(),
      userId: a.string(),
      user: a.belongsTo('User', 'userId'),
      firstName: a.string(),
      lastName: a.string(),
      email: a.string(),
      phone: a.string(),
      avatar: a.string(),
    })
    .authorization((allow) => [allow.groups(['admin','member'])]),
  Position: a
    .model({
      id: a.id(),
      portfolioId: a.string(),
      portfolio: a.belongsTo('Portfolio', 'portfolioId'),
      symbol: a.string(),
      costBasis: a.float(),
      quantity: a.float()
    })
    .authorization((allow) => [allow.groups(['admin','member'])]),
  Portfolio: a
    .model({
      id: a.id(),
      name: a.string(),
      userId: a.string(),
      user: a.belongsTo('User', 'userId'),
      positions: a.hasMany('Position', 'portfolioId'),
    })
    .authorization((allow) => [allow.groups(['admin','member'])]),  
  WatchedStock: a
    .model({
      id: a.id(),
      symbol: a.string(),
      name: a.string(),
      watchlistId: a.string(),
      watchlist: a.belongsTo('Watchlist', 'watchlistId'),
    })
    .authorization((allow) => [allow.groups(['admin','member'])]),  
  Watchlist: a
    .model({
      id: a.id(),
      name: a.string(),
      userId: a.string(),
      user: a.belongsTo('User', 'userId'),
      positions: a.hasMany('WatchedStock', 'watchlistId'),
    })
    .authorization((allow) => [allow.groups(['admin','member'])]),  
  PageSettings: a
    .model({
      id: a.id(),
      userId: a.string(),
      user: a.belongsTo('User', 'userId'),
      settings: a.json(),
    })
    .authorization((allow) => [allow.groups(['admin','member'])]),  
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool'
  }
});
