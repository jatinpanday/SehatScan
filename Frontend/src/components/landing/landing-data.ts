import {
  Activity,
  Brain,
  CheckCircle2,
  FileScan,
  FileText,
  Languages,
  Lightbulb,
  LockKeyhole,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UploadCloud,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const trustItems: FeatureItem[] = [
  {
    icon: Brain,
    title: "AI-powered analysis",
    description: "Medical report text is converted into simple, structured health insights.",
  },
  {
    icon: ShieldCheck,
    title: "Secure reports",
    description: "Private uploads and access-controlled report history for every account.",
  },
  {
    icon: Zap,
    title: "Fast insights",
    description: "OCR and AI workflows help surface key findings without manual reading.",
  },
  {
    icon: Languages,
    title: "Hindi + English",
    description: "Beginner-friendly explanations in the language users are comfortable with.",
  },
];

export const features: FeatureItem[] = [
  {
    icon: Sparkles,
    title: "Smart Report Analysis",
    description: "Summarizes complex medical reports into clear, useful language.",
  },
  {
    icon: FileScan,
    title: "OCR Text Extraction",
    description: "Scans PDFs and images to extract readable report text for analysis.",
  },
  {
    icon: Activity,
    title: "Abnormal Value Detection",
    description: "Highlights high, low, borderline, and critical markers for review.",
  },
  {
    icon: Lightbulb,
    title: "AI Health Insights",
    description: "Turns raw values into practical context, precautions, and next steps.",
  },
  {
    icon: Languages,
    title: "Multilingual Support",
    description: "Supports English and Hindi for accessible health understanding.",
  },
  {
    icon: LockKeyhole,
    title: "Secure Storage",
    description: "Keeps uploaded reports protected and available only to the owner.",
  },
  {
    icon: Stethoscope,
    title: "Beginner-Friendly Explanations",
    description: "Avoids dense medical jargon so users can understand what matters.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Doctor Discussion Questions",
    description: "Suggests thoughtful questions to bring into the next appointment.",
  },
];

export const howItWorks = [
  {
    icon: UploadCloud,
    title: "Upload Medical Report",
    description: "Add a PDF or image of a blood test, imaging report, prescription, or summary.",
  },
  {
    icon: Brain,
    title: "AI Analyzes the Report",
    description: "OCR extracts text, then AI identifies findings, abnormal values, and precautions.",
  },
  {
    icon: CheckCircle2,
    title: "Get Simple Health Insights",
    description: "Review a plain-language summary, doctor questions, and action-friendly context.",
  },
];

export const testimonials = [
  {
    quote:
      "SehatScan helped me understand my blood report before my follow-up visit. The doctor questions were especially useful.",
    name: "Aarav Mehta",
    role: "Product manager, Bengaluru",
  },
  {
    quote:
      "The Hindi explanations made the report much easier for my parents to understand without feeling overwhelmed.",
    name: "Neha Sharma",
    role: "Caregiver, Delhi NCR",
  },
  {
    quote:
      "I liked that it called out abnormal values separately and still reminded me to discuss everything with a clinician.",
    name: "Rohan Iyer",
    role: "Founder, Pune",
  },
];

export const faqs = [
  {
    question: "Is this a replacement for doctors?",
    answer:
      "No. SehatScan is an educational AI assistant that helps explain medical reports. It is not a diagnosis or substitute for professional medical advice.",
  },
  {
    question: "Which reports are supported?",
    answer:
      "The platform supports common PDFs and image uploads such as lab reports, imaging reports, prescriptions, discharge summaries, vaccination documents, and other health files.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Reports are tied to authenticated accounts, uploaded securely, and retrieved through protected access. The product is designed around private user report history.",
  },
  {
    question: "Does it support Hindi?",
    answer:
      "Yes. SehatScan supports English and Hindi so users can read health insights in a familiar language.",
  },
  {
    question: "How accurate is AI analysis?",
    answer:
      "AI can help identify patterns and explain values, but report interpretation depends on clinical context. Users should confirm important findings with a qualified doctor.",
  },
];

export const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Privacy", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

export const reportRows = [
  { marker: "Hemoglobin", value: "10.8 g/dL", range: "13.0 - 17.0", status: "Low" },
  { marker: "WBC Count", value: "7,600 /µL", range: "4,000 - 11,000", status: "Normal" },
  { marker: "Vitamin D", value: "18 ng/mL", range: "30 - 100", status: "Low" },
];

export const navItems = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Preview", href: "#preview" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

export const supportedReportTypes = [
  { icon: FileText, label: "Blood reports" },
  { icon: FileScan, label: "PDF scans" },
  { icon: Stethoscope, label: "Doctor notes" },
];
