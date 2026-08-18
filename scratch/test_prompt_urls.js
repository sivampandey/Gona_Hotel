const promptUrls = [
  { name: 'Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80' },
  { name: 'Dal', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80' },
  { name: 'Paneer', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80' },
  { name: 'Chicken', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80' },
  { name: 'Mutton', url: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&q=80' },
  { name: 'Mix Veg', url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600&q=80' },
  { name: 'Rajma/Chole', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80' },
  { name: 'Naan/Roti', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80' },
  { name: 'Jeera Rice', url: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80' },
  { name: 'Fried Rice', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80' },
  { name: 'Samosa/Pakora', url: 'https://images.unsplash.com/photo-1601050690117-94f5f7a77fc3?w=600&q=80' },
  { name: 'Tandoori', url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80' },
  { name: 'Soup', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80' },
  { name: 'Salad', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80' },
  { name: 'Breakfast', url: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80' },
  { name: 'Chai', url: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&q=80' },
  { name: 'Coffee', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80' },
  { name: 'Juice', url: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80' },
  { name: 'Gulab Jamun', url: 'https://images.unsplash.com/photo-1666761539553-1f74e14cd3d9?w=600&q=80' },
  { name: 'Kheer', url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&q=80' },
  { name: 'Ice Cream', url: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=600&q=80' }
];

async function check() {
  for (const item of promptUrls) {
    try {
      const res = await fetch(item.url, { method: 'HEAD' });
      console.log(`${res.status === 200 ? '✅ 200' : '❌ ' + res.status} [${item.name}]: ${item.url}`);
    } catch (e) {
      console.log(`❌ ERR [${item.name}]: ${e.message}`);
    }
  }
}

check();
