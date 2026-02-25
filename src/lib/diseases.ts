export interface Disease {
  id: string;
  name: string;
  scientificName: string;
  affectedCrops: string[];
  symptoms: string[];
  causes: string;
  treatment: string;
  prevention: string[];
  severity: "mild" | "moderate" | "severe";
  imageUrl: string;
}

export const DISEASES: Disease[] = [
  {
    id: "late-blight",
    name: "Late Blight",
    scientificName: "Phytophthora infestans",
    affectedCrops: ["Tomato", "Potato"],
    symptoms: ["Water-soaked spots on leaves", "White mold on leaf undersides", "Dark brown lesions on stems", "Rapid leaf death"],
    causes: "Caused by oomycete Phytophthora infestans, thrives in cool and wet conditions (60-70°F with high humidity).",
    treatment: "Apply copper-based fungicide immediately. Remove and destroy infected plant parts. Improve air circulation.",
    prevention: ["Use resistant varieties", "Avoid overhead watering", "Space plants for airflow", "Apply preventive fungicides in wet weather"],
    severity: "severe",
    imageUrl: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?w=400",
  },
  {
    id: "powdery-mildew",
    name: "Powdery Mildew",
    scientificName: "Erysiphales order",
    affectedCrops: ["Cucumber", "Squash", "Grapes", "Wheat"],
    symptoms: ["White powdery coating on leaves", "Yellowing leaves", "Stunted growth", "Distorted leaf shape"],
    causes: "Fungal disease spread by wind. Favored by warm days, cool nights, and high humidity without rain.",
    treatment: "Apply neem oil or potassium bicarbonate spray. Remove severely infected leaves. Improve spacing.",
    prevention: ["Plant resistant varieties", "Ensure proper spacing", "Avoid excessive nitrogen", "Water at base of plants"],
    severity: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
  },
  {
    id: "bacterial-leaf-spot",
    name: "Bacterial Leaf Spot",
    scientificName: "Xanthomonas spp.",
    affectedCrops: ["Pepper", "Tomato", "Lettuce"],
    symptoms: ["Small dark spots on leaves", "Spots with yellow halos", "Leaf drop", "Fruit lesions"],
    causes: "Bacterial infection spread through water splash, contaminated seeds, and infected plant debris.",
    treatment: "Apply copper bactericide. Remove infected plants. Avoid working with wet plants.",
    prevention: ["Use disease-free seeds", "Rotate crops", "Avoid overhead irrigation", "Remove crop debris"],
    severity: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400",
  },
  {
    id: "rust",
    name: "Rust Disease",
    scientificName: "Pucciniales order",
    affectedCrops: ["Wheat", "Corn", "Beans", "Coffee"],
    symptoms: ["Orange/brown pustules on leaves", "Powdery spore masses", "Premature leaf drop", "Reduced yield"],
    causes: "Fungal pathogens that require living plant tissue. Spread by wind-borne spores in warm, humid conditions.",
    treatment: "Apply triazole-based fungicide. Remove volunteer plants. Improve air circulation.",
    prevention: ["Plant resistant varieties", "Eliminate alternate hosts", "Timely planting", "Crop rotation"],
    severity: "severe",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
  },
  {
    id: "mosaic-virus",
    name: "Mosaic Virus",
    scientificName: "Various (TMV, CMV)",
    affectedCrops: ["Tomato", "Tobacco", "Cucumber", "Pepper"],
    symptoms: ["Mottled light/dark green pattern", "Leaf curling", "Stunted growth", "Reduced fruit quality"],
    causes: "Viral infection spread by aphids, contaminated tools, and mechanical contact with infected plants.",
    treatment: "No cure available. Remove and destroy infected plants immediately. Control aphid vectors.",
    prevention: ["Use virus-free seeds", "Control aphids", "Disinfect tools", "Remove infected plants promptly"],
    severity: "severe",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
  },
  {
    id: "anthracnose",
    name: "Anthracnose",
    scientificName: "Colletotrichum spp.",
    affectedCrops: ["Mango", "Avocado", "Beans", "Strawberry"],
    symptoms: ["Dark sunken lesions on fruits", "Leaf spots with concentric rings", "Twig dieback", "Blossom blight"],
    causes: "Fungal infection favored by warm, wet weather. Spreads through rain splash and contaminated tools.",
    treatment: "Apply copper fungicide or chlorothalonil. Prune infected branches. Improve drainage.",
    prevention: ["Remove fallen fruit/debris", "Prune for air circulation", "Apply preventive fungicides", "Use resistant cultivars"],
    severity: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=400",
  },
];
