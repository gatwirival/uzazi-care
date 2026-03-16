import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, FileText, Users, TrendingUp, Sparkles, Check, ChevronRight, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="UzaziCare" width={36} height={36} className="rounded-lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                UzaziCare
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-rose-600 transition-colors">
                Features
              </a>
              <a href="#benefits" className="text-gray-600 hover:text-rose-600 transition-colors">
                Benefits
              </a>
              <Link 
                href="/auth/login"
                className="text-gray-600 hover:text-rose-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg text-white font-semibold">
                  Get Started
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-rose-200 mb-8">
              <Sparkles className="h-4 w-4 text-rose-500 mr-2" />
              <span className="text-sm font-medium text-rose-700">
                AI-Powered Women&apos;s Health Companion
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-rose-800 to-pink-900 bg-clip-text text-transparent">
                Your Health Journey,
              </span>
              <br />
              <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                Beautifully Guided
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              AI-powered menstrual health tracking, pregnancy support, and postpartum care — 
              all in one compassionate platform designed for women, by women&apos;s health experts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/register"
                className="group relative inline-flex items-center justify-center"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl text-white font-semibold flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              
              <a href="#features" className="px-8 py-4 bg-white rounded-xl text-gray-900 font-semibold border border-rose-200 hover:border-rose-300 transition-all hover:shadow-lg">
                Learn More
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-rose-500" />
                <span>Safe & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-rose-500" />
                <span>AI-Backed Insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-rose-500" />
                <span>Expert-Reviewed</span>
              </div>
            </div>
          </div>

          {/* Stats Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-pink-400/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/40 backdrop-blur-xl rounded-3xl border border-rose-100 p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Women Supported</h3>
                    <TrendingUp className="h-5 w-5 text-rose-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">12,400+</div>
                  <div className="text-sm text-rose-600">Across all health journeys</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Cycles Tracked</h3>
                    <span className="text-lg">🌸</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">85,000+</div>
                  <div className="text-sm text-purple-600">AI insights generated</div>
                </div>
                
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Safe Deliveries</h3>
                    <span className="text-lg">👶</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">3,200+</div>
                  <div className="text-sm text-pink-600">Pregnancies supported</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-rose-700 bg-clip-text text-transparent">
              Complete Women&apos;s Health Care
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every stage of your health journey, lovingly supported
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
              <div className="relative bg-white rounded-2xl p-8 border border-rose-100 transition-all">
                <div className="text-4xl mb-4">🌸</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Menstrual AI Assistant
                </h3>
                <p className="text-gray-600">
                  Track cycles, understand PMS patterns, manage pain, and get personalized hormonal health insights from our AI.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
              <div className="relative bg-white rounded-2xl p-8 border border-purple-100 transition-all">
                <div className="text-4xl mb-4">🤰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Pregnancy Care Companion
                </h3>
                <p className="text-gray-600">
                  Week-by-week fetal development, nutrition guidance, danger sign detection, and birth preparation support.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
              <div className="relative bg-white rounded-2xl p-8 border border-pink-100 transition-all">
                <div className="text-4xl mb-4">👶</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Postpartum Recovery Guide
                </h3>
                <p className="text-gray-600">
                  Physical recovery support, breastfeeding guidance, postpartum depression screening, and newborn care tips.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
              <div className="relative bg-white rounded-2xl p-8 border border-red-100 transition-all">
                <div className="text-4xl mb-4">🚨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Emergency Warning System
                </h3>
                <p className="text-gray-600">
                  Instant RED/AMBER/GREEN triage for danger signs. Know immediately when to seek emergency care.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
              <div className="relative bg-white rounded-2xl p-8 border border-rose-100 transition-all">
                <div className="bg-gradient-to-br from-rose-500 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI Health Chat
                </h3>
                <p className="text-gray-600">
                  24/7 access to specialized AI health assistants who understand women&apos;s bodies and concerns.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
              <div className="relative bg-white rounded-2xl p-8 border border-fuchsia-100 transition-all">
                <div className="bg-gradient-to-br from-fuchsia-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Health Education Library
                </h3>
                <p className="text-gray-600">
                  Evidence-based articles and resources on every aspect of women&apos;s reproductive health and wellness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Your Health. Your Journey. Your Power.
              </h2>
              <p className="text-xl text-rose-100 mb-10 max-w-2xl mx-auto">
                Join thousands of women using UzaziCare to understand their bodies and navigate every stage of their health journey with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white text-rose-600 rounded-xl font-semibold hover:bg-rose-50 transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Start Your Journey Free</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/auth/login" className="px-8 py-4 bg-rose-700 text-white rounded-xl font-semibold hover:bg-rose-800 transition-all border border-rose-400">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-rose-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Health Areas</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-rose-600 transition-colors">Menstrual Health</a></li>
                <li><a href="#features" className="text-gray-600 hover:text-rose-600 transition-colors">Pregnancy Care</a></li>
                <li><a href="#features" className="text-gray-600 hover:text-rose-600 transition-colors">Postpartum</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Health Library</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">AI Agents</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Medical Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-rose-100 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image src="/logo.png" alt="UzaziCare" width={28} height={28} className="rounded" />
              <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                UzaziCare
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 UzaziCare. All rights reserved. 💜
            </p>
          </div>
        </div>
      </footer>
    </div>
  )};
