import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'fundamentals-asset-storage',
  access: (allow) => ({
    'icons/*': [
        allow.authenticated.to(['read'])
    ]
  })
});