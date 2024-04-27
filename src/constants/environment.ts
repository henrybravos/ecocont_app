const DOMAIN = process.env.EXPO_PUBLIC_API_DOMAIN || ''
export const URL_HTTPS = `https://${DOMAIN}`
export const URL_API = `${URL_HTTPS}/api`
export const WS_URL = `wss://${DOMAIN}/graphql`
export const URI_IMAGE_PRICE = `${URL_HTTPS}/images/precios/`
