import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const posts = await getCollection('blog');
const pages = Object.fromEntries(posts.map((post) => [post.id, post.data]));

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.dek ?? page.description,
    bgGradient: [[251, 250, 246]],
    border: { color: [20, 22, 26], width: 0 },
    padding: 80,
    font: {
      title: { color: [20, 22, 26], size: 64, weight: 'Normal' },
      description: { color: [110, 112, 121], size: 28 },
    },
  }),
});
