import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  ArrowLeftIcon, 
  SparklesIcon, 
  EyeIcon, 
  ArrowRightIcon,
  LightBulbIcon,
  PaintBrushIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface GenerationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export default function AIGenerate() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSite, setGeneratedSite] = useState<any>(null);
  const [formData, setFormData] = useState({
    businessType: '',
    businessName: '',
    description: '',
    targetAudience: '',
    style: '',
    colors: '',
    features: [] as string[]
  });

  const steps: GenerationStep[] = [
    {
      id: 'business-info',
      title: 'Business Information',
      description: 'Tell us about your business',
      completed: false,
      current: true
    },
    {
      id: 'design-preferences',
      title: 'Design Preferences',
      description: 'Choose your style and colors',
      completed: false,
      current: false
    },
    {
      id: 'features',
      title: 'Features & Functionality',
      description: 'Select what you need',
      completed: false,
      current: false
    },
    {
      id: 'generate',
      title: 'Generate Website',
      description: 'AI creates your site',
      completed: false,
      current: false
    }
  ];

  const businessTypes = [
    'E-commerce Store',
    'Digital Art Gallery',
    'NFT Marketplace',
    'Crypto Services',
    'DeFi Platform',
    'Gaming Platform',
    'Educational Platform',
    'Portfolio/Personal'
  ];

  const designStyles = [
    { id: 'modern', name: 'Modern & Clean', description: 'Minimalist design with clean lines' },
    { id: 'bold', name: 'Bold & Vibrant', description: 'Eye-catching colors and dynamic layouts' },
    { id: 'elegant', name: 'Elegant & Sophisticated', description: 'Refined and professional appearance' },
    { id: 'playful', name: 'Playful & Creative', description: 'Fun and engaging design elements' },
    { id: 'tech', name: 'Tech & Futuristic', description: 'Cutting-edge and innovative look' },
    { id: 'classic', name: 'Classic & Timeless', description: 'Traditional and reliable design' }
  ];

  const availableFeatures = [
    'Product Catalog',
    'Shopping Cart',
    'User Authentication',
    'Payment Integration',
    'Blog/News Section',
    'Contact Forms',
    'Live Chat',
    'Analytics Dashboard',
    'Social Media Integration',
    'Email Newsletter',
    'Search Functionality',
    'Multi-language Support'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation process
    setTimeout(() => {
      setGeneratedSite({
        preview: 'Generated website preview',
        pages: ['Home', 'Products', 'About', 'Contact'],
        components: ['Header', 'Hero Section', 'Product Grid', 'Footer']
      });
      setIsGenerating(false);
    }, 3000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              >
                <option value="">Select your business type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base resize-none"
                placeholder="Describe what your business does, your products/services, and what makes you unique..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Who are your ideal customers? (e.g., crypto enthusiasts, digital artists, gamers)"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">
                Design Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {designStyles.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => setFormData({...formData, style: style.id})}
                    className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all touch-manipulation active:scale-95 ${
                      formData.style === style.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{style.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{style.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Preferences
              </label>
              <input
                type="text"
                value={formData.colors}
                onChange={(e) => setFormData({...formData, colors: e.target.value})}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Describe your preferred colors (e.g., blue and white, dark theme, vibrant colors)"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">
                Select Features for Your Website
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {availableFeatures.map((feature) => (
                  <label
                    key={feature}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors touch-manipulation"
                  >
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            features: [...formData.features, feature]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            features: formData.features.filter(f => f !== feature)
                          });
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-xs sm:text-sm font-medium text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            {!isGenerating && !generatedSite ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
                  <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Ready to Generate!</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Our AI will create a custom website based on your preferences.
                    This usually takes 30-60 seconds.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-left">
                  <h4 className="font-medium text-gray-900 mb-3">Summary:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><strong>Business:</strong> {formData.businessName} ({formData.businessType})</div>
                    <div><strong>Style:</strong> {designStyles.find(s => s.id === formData.style)?.name}</div>
                    <div><strong>Features:</strong> {formData.features.length} selected</div>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
                >
                  Generate My Website
                </button>
              </div>
            ) : isGenerating ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Creating Your Website...</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Our AI is analyzing your requirements and generating a custom design.
                  </p>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-gray-500">
                  <div>✓ Analyzing business requirements</div>
                  <div>✓ Generating design layout</div>
                  <div className="animate-pulse">⏳ Creating components...</div>
                  <div className="text-gray-300">⏳ Optimizing for Web3</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Website Generated!</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Your custom Web3 store has been created. You can preview and customize it further.
                  </p>
                </div>

                <div className="bg-white border rounded-lg p-4 sm:p-6">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <GlobeAltIcon className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm text-gray-600">Website Preview</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{formData.businessName}</div>
                      <div className="text-sm text-gray-500">{generatedSite?.pages?.length} pages created</div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium touch-manipulation">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Preview
                      </button>
                      <button className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium touch-manipulation">
                        <PaintBrushIcon className="w-4 h-4 mr-1" />
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <button
              onClick={() => router.back()}
              className="flex items-center p-2 -ml-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors touch-manipulation"
            >
              <ArrowLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              <span className="text-sm sm:text-base font-medium">Back</span>
            </button>
          </div>

          <div className="flex items-center">
            <LightBulbIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mr-2" />
            <span className="text-xs sm:text-sm text-gray-600">AI-Powered</span>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            AI Website Generator
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Create your Web3 store with AI
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 px-4 sm:px-6 py-4 rounded-lg border mb-6 sm:mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-max sm:min-w-0">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full ${
                  index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {index < currentStep ? (
                    <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-xs sm:text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="ml-2 sm:ml-3 hidden sm:block">
                  <div className={`text-xs sm:text-sm font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 hidden lg:block">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-12 h-0.5 mx-2 sm:mx-4 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border p-4 sm:p-6 lg:p-8">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">{steps[currentStep].description}</p>
          </div>

          {renderStepContent()}

          {/* Navigation Buttons */}
          {currentStep < 3 && (
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-6 sm:mt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base touch-manipulation"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </button>

              <button
                onClick={handleNext}
                className="flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm sm:text-base touch-manipulation active:scale-95"
              >
                Next
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 