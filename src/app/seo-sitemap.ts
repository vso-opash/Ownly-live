export const seoSitemap: ISitemapTag[] = [
    { customUrl: '/contact', title: null, description: 'Some description there', image: '/assets/path/to/image' },
  { customUrl: '/about', title: 'custom about title', description: 'Some description about', image: '/assets/path/to/another-image' }
  ];
  
  export interface ISitemapTag {
    customUrl: string;
    title: string | null;
    description: string | null;
    image: string | null;
  }
  