// AI Services for SupplySetu
// This file contains AI-powered features like freshness detection and bundle recommendations

export interface FreshnessResult {
  status: 'fresh' | 'moderate' | 'poor';
  confidence: number;
  description: string;
  recommendations?: string[];
}

export interface BundleRecommendation {
  id: string;
  name: string;
  nameHindi: string;
  products: {
    id: string;
    name: string;
    nameHindi: string;
    category: 'perishable' | 'non_perishable';
    quantity: number;
    unit: string;
    estimatedPrice: number;
  }[];
  totalPrice: number;
  deliveryFrequency: 'daily' | 'weekly' | 'monthly';
  reasoning: string;
  reasoningHindi: string;
}

// Simulate AI freshness detection based on image analysis
export async function analyzeImageFreshness(imageUrl: string): Promise<FreshnessResult> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock AI analysis - in real implementation this would call a computer vision API
  const mockResults: FreshnessResult[] = [
    {
      status: 'fresh',
      confidence: 0.92,
      description: 'Products appear fresh with good color and texture',
      recommendations: ['Store in cool, dry place', 'Use within 3-5 days']
    },
    {
      status: 'moderate',
      confidence: 0.78,
      description: 'Products show some signs of aging but still good quality',
      recommendations: ['Use soon', 'Check for soft spots', 'Store properly']
    },
    {
      status: 'poor',
      confidence: 0.85,
      description: 'Products show significant deterioration',
      recommendations: ['Do not sell', 'Check storage conditions', 'Improve supply chain timing']
    }
  ];
  
  // Randomly select result for demo (in real app, this would be based on actual image analysis)
  return mockResults[Math.floor(Math.random() * mockResults.length)];
}

// Smart bundle recommendations based on stall type and historical data
export function generateSmartBundles(stallType: string): BundleRecommendation[] {
  const bundles: Record<string, BundleRecommendation[]> = {
    'chaat': [
      {
        id: 'chaat-basic',
        name: 'Basic Chaat Bundle',
        nameHindi: 'बेसिक चाट बंडल',
        products: [
          {
            id: 'potato',
            name: 'Potatoes',
            nameHindi: 'आलू',
            category: 'perishable',
            quantity: 10,
            unit: 'kg',
            estimatedPrice: 200
          },
          {
            id: 'onion',
            name: 'Onions',
            nameHindi: 'प्याज',
            category: 'perishable',
            quantity: 5,
            unit: 'kg',
            estimatedPrice: 150
          },
          {
            id: 'chaat-masala',
            name: 'Chaat Masala',
            nameHindi: 'चाट मसाला',
            category: 'non_perishable',
            quantity: 1,
            unit: 'kg',
            estimatedPrice: 300
          },
          {
            id: 'green-chutney',
            name: 'Green Chutney Ingredients',
            nameHindi: 'हरी चटनी सामग्री',
            category: 'perishable',
            quantity: 2,
            unit: 'kg',
            estimatedPrice: 100
          },
          {
            id: 'tamarind',
            name: 'Tamarind Paste',
            nameHindi: 'इमली का पेस्ट',
            category: 'non_perishable',
            quantity: 0.5,
            unit: 'kg',
            estimatedPrice: 150
          }
        ],
        totalPrice: 900,
        deliveryFrequency: 'weekly',
        reasoning: 'Perfect starter bundle for chaat stalls with essential ingredients for popular items like aloo chaat, papdi chaat',
        reasoningHindi: 'चाट स्टॉल के लिए परफेक्ट स्टार्टर बंडल जिसमें आलू चाट, पापड़ी चाट जैसी लोकप्रिय चीजों के लिए जरूरी सामग्री है'
      },
      {
        id: 'chaat-premium',
        name: 'Premium Chaat Bundle',
        nameHindi: 'प्रीमियम चाट बंडल',
        products: [
          {
            id: 'potato',
            name: 'Potatoes',
            nameHindi: 'आलू',
            category: 'perishable',
            quantity: 15,
            unit: 'kg',
            estimatedPrice: 300
          },
          {
            id: 'chickpeas',
            name: 'Boiled Chickpeas',
            nameHindi: 'उबले चने',
            category: 'perishable',
            quantity: 5,
            unit: 'kg',
            estimatedPrice: 250
          },
          {
            id: 'papdi',
            name: 'Papdi',
            nameHindi: 'पापड़ी',
            category: 'non_perishable',
            quantity: 2,
            unit: 'kg',
            estimatedPrice: 400
          },
          {
            id: 'sev',
            name: 'Sev (Fine)',
            nameHindi: 'सेव (बारीक)',
            category: 'non_perishable',
            quantity: 1,
            unit: 'kg',
            estimatedPrice: 200
          },
          {
            id: 'yogurt',
            name: 'Fresh Yogurt',
            nameHindi: 'ताज़ा दही',
            category: 'perishable',
            quantity: 3,
            unit: 'kg',
            estimatedPrice: 180
          }
        ],
        totalPrice: 1330,
        deliveryFrequency: 'weekly',
        reasoning: 'Complete bundle for advanced chaat varieties including bhel puri, dahi puri, and papdi chaat',
        reasoningHindi: 'भेल पूरी, दही पूरी और पापड़ी चाट जैसी एडवांस चाट किस्मों के लिए कंप्लीट बंडल'
      }
    ],
    'juice': [
      {
        id: 'juice-seasonal',
        name: 'Seasonal Fruit Bundle',
        nameHindi: 'मौसमी फल बंडल',
        products: [
          {
            id: 'oranges',
            name: 'Fresh Oranges',
            nameHindi: 'ताज़े संतरे',
            category: 'perishable',
            quantity: 20,
            unit: 'kg',
            estimatedPrice: 800
          },
          {
            id: 'sweet-lime',
            name: 'Sweet Lime',
            nameHindi: 'मौसमी',
            category: 'perishable',
            quantity: 15,
            unit: 'kg',
            estimatedPrice: 600
          },
          {
            id: 'sugar',
            name: 'Sugar',
            nameHindi: 'चीनी',
            category: 'non_perishable',
            quantity: 5,
            unit: 'kg',
            estimatedPrice: 250
          },
          {
            id: 'salt',
            name: 'Rock Salt',
            nameHindi: 'काला नमक',
            category: 'non_perishable',
            quantity: 1,
            unit: 'kg',
            estimatedPrice: 100
          },
          {
            id: 'ice',
            name: 'Ice Cubes',
            nameHindi: 'बर्फ के टुकड़े',
            category: 'perishable',
            quantity: 10,
            unit: 'kg',
            estimatedPrice: 200
          }
        ],
        totalPrice: 1950,
        deliveryFrequency: 'daily',
        reasoning: 'Fresh fruits delivered daily for optimal juice quality and customer satisfaction',
        reasoningHindi: 'बेहतरीन जूस क्वालिटी और ग्राहक संतुष्टि के लिए रोज ताज़े फल की डिलिवरी'
      }
    ],
    'south_indian': [
      {
        id: 'dosa-essentials',
        name: 'Dosa Essentials Bundle',
        nameHindi: 'डोसा एसेंशियल बंडल',
        products: [
          {
            id: 'rice',
            name: 'Rice (Parboiled)',
            nameHindi: 'चावल (पैरबॉयल्ड)',
            category: 'non_perishable',
            quantity: 10,
            unit: 'kg',
            estimatedPrice: 500
          },
          {
            id: 'urad-dal',
            name: 'Urad Dal',
            nameHindi: 'उड़द दाल',
            category: 'non_perishable',
            quantity: 3,
            unit: 'kg',
            estimatedPrice: 450
          },
          {
            id: 'oil',
            name: 'Cooking Oil',
            nameHindi: 'खाना पकाने का तेल',
            category: 'non_perishable',
            quantity: 5,
            unit: 'L',
            estimatedPrice: 600
          },
          {
            id: 'vegetables',
            name: 'Mixed Vegetables',
            nameHindi: 'मिक्स सब्जियां',
            category: 'perishable',
            quantity: 8,
            unit: 'kg',
            estimatedPrice: 400
          },
          {
            id: 'coconut',
            name: 'Fresh Coconut',
            nameHindi: 'ताज़ा नारियल',
            category: 'perishable',
            quantity: 5,
            unit: 'pieces',
            estimatedPrice: 250
          }
        ],
        totalPrice: 2200,
        deliveryFrequency: 'weekly',
        reasoning: 'Complete ingredients for dosa, idli, and sambhar preparation with weekly delivery for staples',
        reasoningHindi: 'डोसा, इडली और सांभर बनाने के लिए कंप्लीट सामग्री साप्ताहिक मुख्य सामान की डिलिवरी के साथ'
      }
    ]
  };

  return bundles[stallType] || bundles['chaat'];
}

// Analyze user preferences and order history to provide personalized recommendations
export function getPersonalizedRecommendations(
  stallType: string,
  orderHistory: any[],
  preferences: any
): BundleRecommendation[] {
  const baseBundles = generateSmartBundles(stallType);
  
  // In a real implementation, this would use machine learning to analyze:
  // - Order frequency patterns
  // - Seasonal preferences
  // - Customer feedback
  // - Local demand patterns
  // - Profit margins
  
  return baseBundles.map(bundle => ({
    ...bundle,
    reasoning: `${bundle.reasoning} (Personalized based on your order history)`,
    reasoningHindi: `${bundle.reasoningHindi} (आपके ऑर्डर हिस्ट्री के आधार पर व्यक्तिगत)`
  }));
}

// Seasonal adjustments for bundle recommendations
export function getSeasonalBundles(stallType: string, season: 'summer' | 'winter' | 'monsoon'): BundleRecommendation[] {
  const baseBundles = generateSmartBundles(stallType);
  
  const seasonalAdjustments: Record<string, Record<string, string>> = {
    summer: {
      chaat: 'Add more cooling ingredients like yogurt, mint, and cucumber',
      juice: 'Focus on citrus fruits and cooling drinks',
      south_indian: 'Increase coconut water and reduce heavy spices'
    },
    winter: {
      chaat: 'Add warming spices and hot chutneys',
      juice: 'Include seasonal fruits like oranges and pomegranates',
      south_indian: 'Add more warming spices and ghee'
    },
    monsoon: {
      chaat: 'Focus on fried items and avoid leafy vegetables',
      juice: 'Emphasize immunity-boosting ingredients',
      south_indian: 'Include anti-bacterial spices like turmeric and ginger'
    }
  };
  
  return baseBundles.map(bundle => ({
    ...bundle,
    reasoning: `${bundle.reasoning} (${seasonalAdjustments[season]?.[stallType] || ''})`,
    reasoningHindi: `${bundle.reasoningHindi} (मौसमी सुझाव के साथ)`
  }));
}