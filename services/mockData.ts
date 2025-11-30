import { Product, Review, Coupon, Order } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Natural Peanut Butter',
    shortDescription: '100% Roasted Peanuts, No Added Sugar.',
    description: 'Experience the pure taste of high-quality peanuts roasted to perfection. Our Natural Peanut Butter is rich in protein, heart-healthy fats, and contains zero added sugar or preservatives. Perfect for fitness enthusiasts.',
    image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&q=80&w=800', // Main Jar
    images: [
      'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&q=80&w=800', // Product Jar
      'https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?auto=format&fit=crop&q=80&w=800', // Texture/Spoon
      'https://images.unsplash.com/photo-1555675404-5d519d9b6e68?auto=format&fit=crop&q=80&w=800'  // Lifestyle/Breakfast
    ],
    rating: 4.8,
    reviewsCount: 1240,
    tags: ['Best Seller', 'Vegan', 'Keto'],
    variants: [
      { weight: '500g', price: 262, sku: 'NPB-500' },
      { weight: '1kg', price: 449, sku: 'NPB-1000' }
    ]
  },
  {
    id: 'p2',
    name: 'Choco Nut Delights',
    shortDescription: 'Decadent chocolate swirl with crunch.',
    description: 'A guilt-free dessert replacement. Premium cocoa blended with our signature roasted peanuts. High protein meets high taste. Kids love it, adults crave it.',
    image: 'https://picsum.photos/id/835/600/600', // Placeholder
    images: [
      'https://picsum.photos/id/835/600/600',
      'https://picsum.photos/id/425/600/600',
      'https://picsum.photos/id/312/600/600'
    ],
    rating: 4.9,
    reviewsCount: 856,
    tags: ['New Arrival', 'Sweet', 'Kids Favorite'],
    variants: [
      { weight: '500g', price: 349, sku: 'CND-500' },
      { weight: '1kg', price: 599, sku: 'CND-1000' }
    ]
  },
  {
    id: 'p3',
    name: 'Crunchy Honey Roast',
    shortDescription: 'Sweetened with organic honey.',
    description: 'The perfect balance of sweet and savory. Roasted with organic honey for a caramelized crunch that adds texture to your morning toast or smoothie bowls.',
    image: 'https://picsum.photos/id/493/600/600', // Placeholder
    images: [
      'https://picsum.photos/id/493/600/600',
      'https://picsum.photos/id/429/600/600',
      'https://picsum.photos/id/488/600/600'
    ],
    rating: 4.7,
    reviewsCount: 430,
    tags: ['Organic', 'Crunchy'],
    variants: [
      { weight: '500g', price: 299, sku: 'CHR-500' },
      { weight: '1kg', price: 549, sku: 'CHR-1000' }
    ]
  }
];

// Using placeholder video URLs that are safe for general audiences (mix of food/fitness)
export const REVIEWS: Review[] = [
  { 
    id: 'r1', 
    author: 'Rahul S.', 
    rating: 5, 
    text: 'Best protein kick ever! The natural taste is unmatched.', 
    date: '2 days ago', 
    avatar: 'https://picsum.photos/id/1005/100/100',
    videoUrl: 'https://videos.pexels.com/video-files/4114797/4114797-uhd_2560_1440_25fps.mp4',
    thumbnail: 'https://images.pexels.com/photos/3768910/pexels-photo-3768910.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    id: 'r2', 
    author: 'Priya M.', 
    rating: 5, 
    text: 'Finally a healthy choco spread my kids actually eat.', 
    date: '1 week ago', 
    avatar: 'https://picsum.photos/id/1011/100/100',
    videoUrl: 'https://videos.pexels.com/video-files/6981411/6981411-uhd_2560_1440_25fps.mp4',
    thumbnail: 'https://images.pexels.com/photos/6981411/pexels-photo-6981411.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    id: 'r3', 
    author: 'Amit K.', 
    rating: 4, 
    text: 'Delivery was super fast. Packaging is premium.', 
    date: '3 days ago', 
    avatar: 'https://picsum.photos/id/1012/100/100',
    videoUrl: 'https://videos.pexels.com/video-files/3209663/3209663-uhd_2560_1440_25fps.mp4',
    thumbnail: 'https://images.pexels.com/photos/3756050/pexels-photo-3756050.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    id: 'r4', 
    author: 'Sneha R.', 
    rating: 5, 
    text: 'Love the consistency. Not too oily, just perfect.', 
    date: '5 days ago', 
    avatar: 'https://picsum.photos/id/1027/100/100',
    videoUrl: 'https://videos.pexels.com/video-files/4253139/4253139-uhd_2560_1440_25fps.mp4',
    thumbnail: 'https://images.pexels.com/photos/4253139/pexels-photo-4253139.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    id: 'r5', 
    author: 'Vikram B.', 
    rating: 5, 
    text: 'Gym essential. 1kg tub lasts me a month.', 
    date: 'Just now', 
    avatar: 'https://picsum.photos/id/1006/100/100',
    videoUrl: 'https://videos.pexels.com/video-files/3196236/3196236-uhd_2560_1440_25fps.mp4',
    thumbnail: 'https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
];

export const COUPONS: Coupon[] = [
  { code: 'WELCOME20', discountType: 'PERCENTAGE', value: 20, description: '20% Off your first order' },
  { code: 'SAVE50', discountType: 'FIXED', value: 50, minOrderValue: 500, description: 'Flat ₹50 off on orders above ₹500' }
];

export const ORDERS: Order[] = [
  { id: 'ORD-001', customerName: 'Arjun Verma', total: 898, status: 'Delivered', date: '2023-10-15', items: [] },
  { id: 'ORD-002', customerName: 'Zara Khan', total: 1198, status: 'Shipped', date: '2023-10-20', items: [] },
  { id: 'ORD-003', customerName: 'Leo Das', total: 449, status: 'Processing', date: '2023-10-22', items: [] },
];