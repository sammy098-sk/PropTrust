import React from 'react';
import { ViewState } from '../types';
import { ArrowRight, CheckCircle2, ShieldCheck, Users } from 'lucide-react';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white">
      {/* Hero Content */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
           <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0ea5e9] to-[#bae6fd] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-2xl py-20 sm:py-32 lg:py-40 text-center">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-600 ring-1 ring-slate-900/10 hover:ring-slate-900/20">
              Introducing AI-Powered Investment Analysis. <span className="font-semibold text-brand-600 cursor-pointer" onClick={() => onNavigate(ViewState.INVESTOR_DASHBOARD)}>See how it works <span aria-hidden="true">&rarr;</span></span>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Where Ambition Meets <span className="text-brand-600">Capital</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            BizBridge connects visionary small business owners with investors looking for the next big thing. Use our Gemini-powered tools to craft the perfect pitch or analyze investment risks in seconds.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={() => onNavigate(ViewState.INVESTOR_DASHBOARD)}
              className="rounded-md bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all"
            >
              I'm an Investor
            </button>
            <button
              onClick={() => onNavigate(ViewState.BUSINESS_FORM)}
              className="text-sm font-semibold leading-6 text-slate-900 flex items-center group"
            >
              I need Funding <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-brand-600">Invest Smarter</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to make the right connection
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <ShieldCheck className="h-5 w-5 flex-none text-brand-600" />
                  Vetted Opportunities
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">Every business on our platform is reviewed to ensure legitimate opportunities for our investor community.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <Users className="h-5 w-5 flex-none text-brand-600" />
                  Direct Connection
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">Chat directly with founders. No middlemen, no hidden fees. Build relationships that last.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <CheckCircle2 className="h-5 w-5 flex-none text-brand-600" />
                  AI Analysis
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">Leverage Google Gemini to instantly analyze business models, generate pitch decks, and assess risk.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
