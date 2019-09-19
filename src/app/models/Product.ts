export interface Product {
    id: string;
    name: string;
    price: number;
    url: string;
    image: string;
    description?: string;
    dimensions?: ProductDimensions;
    features: string[];
    featured: boolean;
  }
  
  export interface ProductDimensions {
    weight: number;
    height?: number;
    length?: number;
    width?: number;
  }