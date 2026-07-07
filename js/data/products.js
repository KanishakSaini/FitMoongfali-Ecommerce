// Single source of truth for product data.
// Both the home page (main.js) and the checkout page (checkout.js) import this,
// so pricing and details only ever need to be updated in one place.
// Image paths are relative to the HTML documents at the project root.

export const products = [
  {
    id: "classic-creamy",
    name: "Classic Creamy",
    shortDescription: "Silky roasted peanut butter for clean breakfasts, smoothies, and pre-workout fuel.",
    description: "Classic Creamy is the everyday jar for people who want smooth texture, rich peanut flavor, and a dependable clean-label spread.",
    tag: "Signature",
    price: 249,
    weight: "340g",
    image: "assets/images/jar-classic.svg",
    imageAlt: "Classic Creamy peanut butter jar",
    features: ["High protein", "No added oil", "No preservatives"],
    ingredients: "Roasted peanuts, a touch of jaggery, and pink salt.",
    nutrition: "Approx. per 100g: Protein 26g, Healthy fats 49g, Carbohydrates 18g.",
    benefits: "Great for breakfast, post-workout shakes, toast, oats, and guilt-free snacking.",
    storage: "Stir if natural oil separation happens. Store in a cool, dry place and always use a dry spoon.",
    bestFor: "Students, working professionals, and anyone who wants a versatile everyday jar."
  },
  {
    id: "crunchy-power",
    name: "Crunchy Power",
    shortDescription: "Bold peanut crunch with a satisfying bite for people who like texture in every spoon.",
    description: "Crunchy Power brings together roasted depth and peanut bits for a more textured, snackable experience.",
    tag: "Best Seller",
    price: 269,
    weight: "340g",
    image: "assets/images/jar-crunchy.svg",
    imageAlt: "Crunchy Power peanut butter jar",
    features: ["Crunchy texture", "Freshly made", "Protein-rich"],
    ingredients: "Roasted peanuts, crushed peanut bits, jaggery, and pink salt.",
    nutrition: "Approx. per 100g: Protein 25g, Healthy fats 50g, Carbohydrates 19g.",
    benefits: "Adds texture to toast, smoothie bowls, sandwiches, and healthy snacks.",
    storage: "Natural oil separation is normal. Stir well and keep sealed after use.",
    bestFor: "Fitness lovers and families who enjoy a fuller roasted bite."
  },
  {
    id: "chocolate-protein",
    name: "Chocolate Protein",
    shortDescription: "A richer dessert-style option that still feels aligned with a mindful lifestyle.",
    description: "Chocolate Protein is designed for people who want indulgent taste with a premium, fitness-friendly feel.",
    tag: "Premium",
    price: 299,
    weight: "340g",
    image: "assets/images/jar-chocolate.svg",
    imageAlt: "Chocolate Protein peanut butter jar",
    features: ["Cocoa richness", "No preservatives", "Workout-friendly"],
    ingredients: "Roasted peanuts, cocoa, jaggery, whey protein blend, and pink salt.",
    nutrition: "Approx. per 100g: Protein 28g, Healthy fats 46g, Carbohydrates 20g.",
    benefits: "Perfect for smoothies, toast, pancakes, and healthy dessert cravings.",
    storage: "Keep in a cool, dry place. Stir before use if oil separation appears.",
    bestFor: "Gym-goers, students, and anyone who wants a richer flavor profile."
  }
];
