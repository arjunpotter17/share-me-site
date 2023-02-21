
import imageUrlBuilder from '@sanity/image-url'
import {client} from '../client.js'

const urlBuilder = imageUrlBuilder(client);

export const urlFor = (source) => urlBuilder.image(source);