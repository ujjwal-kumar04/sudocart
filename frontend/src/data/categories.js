export const categories = {
  "Fashion & Apparel": {
    icon: "👕",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=70",
    subcategories: [
      "Men Clothing",
      "Women Clothing",
      "Kids Wear",
      "Footwear",
      "Accessories"
    ]
  },
  "Electronics": {
    icon: "📱",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=70",
    subcategories: [
      "Mobiles & Smartphones",
      "Laptops & Computers",
      "Tablets",
      "Headphones & Earbuds",
      "Smart Watches",
      "Cameras",
      "Accessories"
    ]
  },
  "Home & Living": {
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=300&q=70",
    subcategories: [
      "Furniture",
      "Home Decor",
      "Kitchen Appliances",
      "Bedding & Curtains",
      "Lighting"
    ]
  },
  "Grocery & Daily Needs": {
    icon: "🍔",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=70",
    subcategories: [
      "Fruits & Vegetables",
      "Snacks & Beverages",
      "Dairy Products",
      "Personal Care",
      "Household Essentials"
    ]
  },
  "Beauty & Personal Care": {
    icon: "💄",
    image: "https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=300&q=70",
    subcategories: [
      "Makeup",
      "Skincare",
      "Hair Care",
      "Perfumes & Deodorants",
      "Grooming Products"
    ]
  },
  "Books & Stationery": {
    icon: "📚",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=70",
    subcategories: [
      "Academic Books",
      "Novels",
      "Competitive Exam Books",
      "Notebooks",
      "Office Supplies"
    ]
  },
  "Toys, Kids & Baby": {
    icon: "🧸",
    image: "https://images.unsplash.com/photo-1601758174300-3f3e07d1d4c5?auto=format&fit=crop&w=300&q=70",
    subcategories: [
      "Toys",
      "Baby Clothing",
      "Baby Care Products",
      "School Items"
    ]
  },
  "Sports & Fitness": {
    icon: "🏋️",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=300&q=70",
    subcategories: [
      "Gym Equipment",
      "Sports Gear",
      "Fitness Accessories",
      "Yoga Products"
    ]
  },
  "Automobile Accessories": {
    icon: "🚗",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=300&q=70",
    subcategories: [
      "Bike Accessories",
      "Car Accessories",
      "Helmets",
      "Tools & Parts"
    ]
  },
  "Gaming & Entertainment": {
    icon: "🎮",
    image: "https://images.unsplash.com/photo-1580128636820-81a46c2c91e7?auto=format&fit=crop&w=300&q=70",
    subcategories: [
      "Gaming Consoles",
      "Video Games",
      "Gaming Accessories",
      "VR Devices"
    ]
  }
};

export const getCategoryIcon = (category) => {
  return categories[category]?.icon || "📦";
};

export const getCategoryImage = (category) => {
  return categories[category]?.image;
};

export const getSubcategories = (category) => {
  return categories[category]?.subcategories || [];
};

export const getAllCategories = () => {
  return Object.keys(categories);
};
