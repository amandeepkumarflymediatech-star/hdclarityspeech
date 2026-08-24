'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Briefcase, BookOpen, Calendar, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingData {
  name: string;
  email: string;
  phone: string;
  timezone: string;
  bio: string;
  experience: string;
  qualifications: string;
  languages: string;
  teachingHeadline: string;
  teachingLevels: string[];
  teachingAges: string[];
  teachingStyle: string[];
  calendlyUrl: string;
}

export default function OnboardingForm({ initialData }: { initialData?: Partial<OnboardingData> }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'saving' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [data, setData] = useState<OnboardingData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    timezone: initialData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    bio: initialData?.bio || '',
    experience: initialData?.experience || '',
    qualifications: initialData?.qualifications || '',
    languages: initialData?.languages || '',
    teachingHeadline: initialData?.teachingHeadline || '',
    teachingLevels: initialData?.teachingLevels || [],
    teachingAges: initialData?.teachingAges || [],
    teachingStyle: initialData?.teachingStyle || [],
    calendlyUrl: initialData?.calendlyUrl || '',
  });

  const totalSteps = 5;

  const updateData = (fields: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...fields }));
    // Clear field errors for the fields being updated
    const newErrors = { ...fieldErrors };
    Object.keys(fields).forEach(key => delete newErrors[key]);
    setFieldErrors(newErrors);
  };

  const validateStep = (currentStep: number): boolean => {
    const errors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!data.name || data.name.trim().length < 2) errors.name = "Full name is required.";
      const phoneDigits = data.phone.replace(/\D/g, '');
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,20}$/;
      if (!data.phone || !phoneRegex.test(data.phone.trim()) || phoneDigits.length < 10 || phoneDigits.length > 16) {
        errors.phone = "Please enter a valid phone number (10 to 16 digits).";
      }
      if (!data.timezone) errors.timezone = "Timezone is required.";
      if (!data.bio || data.bio.trim().length < 20) errors.bio = "Please write a short bio (at least 20 characters).";
    } else if (currentStep === 2) {
      if (!data.teachingHeadline) errors.teachingHeadline = "Headline is required.";
      if (!data.experience || data.experience.trim().length < 20) errors.experience = "Please detail your experience (at least 20 characters).";
      if (!data.qualifications) errors.qualifications = "Qualifications are required.";
      if (!data.languages) errors.languages = "Languages are required.";
    } else if (currentStep === 3) {
      if (data.teachingLevels.length === 0) errors.teachingLevels = "Select at least one level.";
      if (data.teachingAges.length === 0) errors.teachingAges = "Select at least one age group.";
      if (data.teachingStyle.length === 0) errors.teachingStyle = "Select at least one teaching style.";
    } else if (currentStep === 4) {
      if (data.calendlyUrl && !data.calendlyUrl.startsWith('https://calendly.com/')) {
        errors.calendlyUrl = "Must be a valid Calendly URL starting with https://calendly.com/";
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(step)) return;
    
    if (step < totalSteps) {
      // Save progress
      setStatus('saving');
      try {
        await fetch('/api/tutor/application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'SAVE',
            ...data,
            teachingLevels: JSON.stringify(data.teachingLevels),
            teachingAges: JSON.stringify(data.teachingAges),
            teachingStyle: JSON.stringify(data.teachingStyle),
          }),
        });
        setStep(prev => prev + 1);
        setStatus('idle');
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to save progress. Please try again.');
        setStatus('error');
      }
    }
  };

  const handleSubmit = async () => {
    setStatus('submitting');
    try {
      const res = await fetch('/api/tutor/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUBMIT',
          ...data,
          teachingLevels: JSON.stringify(data.teachingLevels),
          teachingAges: JSON.stringify(data.teachingAges),
          teachingStyle: JSON.stringify(data.teachingStyle),
        }),
      });
      
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Submission failed');
      }
      
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong submitting your application.');
      setStatus('error');
    }
  };

  const toggleArrayItem = (key: keyof Pick<OnboardingData, 'teachingLevels' | 'teachingAges' | 'teachingStyle'>, value: string) => {
    setData(prev => {
      const arr = prev[key] as string[];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter(item => item !== value) };
      }
      return { ...prev, [key]: [...arr, value] };
    });
    setFieldErrors(prev => ({ ...prev, [key]: '' }));
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {[1, 2, 3, 4, 5].map((i) => (
        <React.Fragment key={i}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            step === i ? 'bg-accent text-white shadow-lg scale-110' : 
            step > i ? 'bg-primary text-white' : 'bg-secondary text-primary/40'
          }`}>
            {step > i ? <CheckCircle2 size={18} /> : i}
          </div>
          {i < 5 && (
            <div className={`w-12 h-1 transition-colors ${step > i ? 'bg-primary' : 'bg-secondary'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl w-full mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-primary/5">
      
      {renderStepIndicator()}
      
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-bold text-center">
          {errorMsg}
        </div>
      )}

      {/* STEP 1: Personal Profile */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-primary font-playfair mb-2">Personal Profile</h2>
            <p className="text-primary/60 text-sm">Let's start with your basic contact information.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Full Name</label>
              <input type="text" value={data.name} onChange={e => updateData({ name: e.target.value })} className={`w-full p-4 border bg-transparent focus:border-accent outline-none rounded-xl ${fieldErrors.name ? 'border-red-500' : 'border-secondary'}`} placeholder="Jane Doe" />
              {fieldErrors.name && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" value={data.email} disabled className="w-full p-4 border border-secondary bg-secondary/30 text-primary/70 cursor-not-allowed outline-none rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Phone Number</label>
              <input type="tel" value={data.phone} onChange={e => updateData({ phone: e.target.value })} className={`w-full p-4 border bg-transparent focus:border-accent outline-none rounded-xl ${fieldErrors.phone ? 'border-red-500' : 'border-secondary'}`} placeholder="+1 (555) 000-0000" />
              {fieldErrors.phone && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.phone}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Timezone</label>
              <input type="text" value={data.timezone} onChange={e => updateData({ timezone: e.target.value })} className={`w-full p-4 border bg-transparent focus:border-accent outline-none rounded-xl ${fieldErrors.timezone ? 'border-red-500' : 'border-secondary'}`} placeholder="e.g. America/New_York" />
              {fieldErrors.timezone && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.timezone}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Short Bio</label>
            <textarea value={data.bio} onChange={e => updateData({ bio: e.target.value })} rows={4} className={`w-full p-4 border bg-transparent focus:border-accent outline-none rounded-xl resize-none ${fieldErrors.bio ? 'border-red-500' : 'border-secondary'}`} placeholder="A brief introduction about yourself for your profile..." />
            {fieldErrors.bio && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.bio}</p>}
          </div>
        </div>
      )}

      {/* STEP 2: Professional Background */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-primary font-playfair mb-2">Professional Background</h2>
            <p className="text-primary/60 text-sm">Tell us about your teaching experience and credentials.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Professional Headline</label>
            <input type="text" value={data.teachingHeadline} onChange={e => updateData({ teachingHeadline: e.target.value })} className={`w-full p-4 border bg-transparent focus:border-accent outline-none rounded-xl ${fieldErrors.teachingHeadline ? 'border-red-500' : 'border-secondary'}`} placeholder="e.g. Certified English Communication Trainer" />
            {fieldErrors.teachingHeadline && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.teachingHeadline}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Teaching Experience</label>
            <textarea value={data.experience} onChange={e => updateData({ experience: e.target.value })} rows={3} className={`w-full p-4 border bg-transparent focus:border-accent outline-none rounded-xl resize-none ${fieldErrors.experience ? 'border-red-500' : 'border-secondary'}`} placeholder="I have 5 years of experience helping students..." />
            {fieldErrors.experience && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.experience}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Qualifications & Certifications</label>
              <input type="text" value={data.qualifications} onChange={e => updateData({ qualifications: e.target.value })} className={`w-full p-4 border bg-transparent focus:border-accent outline-none rounded-xl ${fieldErrors.qualifications ? 'border-red-500' : 'border-secondary'}`} placeholder="e.g. MA TESOL, CELTA" />
              {fieldErrors.qualifications && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.qualifications}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Languages Spoken</label>
              <input type="text" value={data.languages} onChange={e => updateData({ languages: e.target.value })} className={`w-full p-4 border bg-transparent focus:border-accent outline-none rounded-xl ${fieldErrors.languages ? 'border-red-500' : 'border-secondary'}`} placeholder="e.g. English (Native), Spanish (C1)" />
              {fieldErrors.languages && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.languages}</p>}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Teaching Preferences */}
      {step === 3 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-primary font-playfair mb-2">Teaching Preferences</h2>
            <p className="text-primary/60 text-sm">Select the areas where you excel.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-4">Student Levels You Teach</label>
            <div className="flex flex-wrap gap-3">
              {['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced'].map(lvl => (
                <button key={lvl} type="button" onClick={() => updateData({ teachingLevels: [lvl] })} className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${data.teachingLevels.includes(lvl) ? 'bg-primary text-white border-primary' : 'bg-transparent text-primary/60 border-secondary hover:border-primary hover:text-primary'}`}>
                  {lvl}
                </button>
              ))}
            </div>
            {fieldErrors.teachingLevels && <p className="text-red-500 text-xs mt-2 font-bold">{fieldErrors.teachingLevels}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-4">Age Groups</label>
            <div className="flex flex-wrap gap-3">
              {['Kids', 'Teens', 'Adults', 'Professionals'].map(age => (
                <button key={age} type="button" onClick={() => toggleArrayItem('teachingAges', age)} className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${data.teachingAges.includes(age) ? 'bg-primary text-white border-primary' : 'bg-transparent text-primary/60 border-secondary hover:border-primary hover:text-primary'}`}>
                  {age}
                </button>
              ))}
            </div>
            {fieldErrors.teachingAges && <p className="text-red-500 text-xs mt-2 font-bold">{fieldErrors.teachingAges}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-4">Teaching Styles & Focus</label>
            <div className="flex flex-wrap gap-3">
              {['Conversational', 'Structured Lessons', 'Practical Exercises', 'Goal-oriented', 'Exam-focused', 'Business English', 'Pronunciation / Accent'].map(style => (
                <button key={style} type="button" onClick={() => toggleArrayItem('teachingStyle', style)} className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${data.teachingStyle.includes(style) ? 'bg-primary text-white border-primary' : 'bg-transparent text-primary/60 border-secondary hover:border-primary hover:text-primary'}`}>
                  {style}
                </button>
              ))}
            </div>
            {fieldErrors.teachingStyle && <p className="text-red-500 text-xs mt-2 font-bold">{fieldErrors.teachingStyle}</p>}
          </div>
        </div>
      )}

      {/* STEP 4: Availability & Calendly */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-primary font-playfair mb-2">Availability & Scheduling</h2>
            <p className="text-primary/60 text-sm">We use Calendly to manage scheduling effortlessly.</p>
          </div>

          <div className="bg-secondary/20 p-6 rounded-2xl border border-secondary text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Calendar className="w-8 h-8 text-[#006BFF]" />
            </div>
            <h3 className="font-bold text-primary">Connect your Calendly</h3>
            <p className="text-sm text-primary/70">
              For this initial setup, please paste your public Calendly scheduling link below. We will use this to allow students to book sessions with you.
            </p>
            
            <div className="mt-6 text-left">
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Your Calendly Link</label>
              <input type="url" value={data.calendlyUrl} onChange={e => updateData({ calendlyUrl: e.target.value })} className={`w-full p-4 border bg-white focus:border-[#006BFF] outline-none rounded-xl ${fieldErrors.calendlyUrl ? 'border-red-500' : 'border-secondary'}`} placeholder="https://calendly.com/your-username" />
              {fieldErrors.calendlyUrl && <p className="text-red-500 text-xs mt-1 font-bold">{fieldErrors.calendlyUrl}</p>}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Submit */}
      {step === 5 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-primary font-playfair mb-2">Review Your Profile</h2>
            <p className="text-primary/60 text-sm">This is a summary of how you will appear to our administration.</p>
          </div>

          <div className="bg-white border-2 border-secondary rounded-3xl p-6 shadow-sm">
            <div className="flex items-start gap-4 border-b border-secondary/50 pb-6 mb-6">
              <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-bold font-playfair">
                {data.name ? data.name.charAt(0).toUpperCase() : (data.teachingHeadline ? data.teachingHeadline.charAt(0) : 'T')}
              </div>
              <div>
                <h3 className="text-xl font-black text-primary font-playfair">{data.name || 'Your Name'}</h3>
                <p className="text-sm font-bold text-accent">{data.teachingHeadline || 'English Communication Coach'}</p>
                <p className="text-sm text-primary/60 mt-1">{data.email} • {data.phone}</p>
              </div>
            </div>
            
            <div className="space-y-6 text-sm font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong className="text-primary block mb-1">Timezone:</strong>
                  <p className="text-primary/70">{data.timezone}</p>
                </div>
                <div>
                  <strong className="text-primary block mb-1">Languages:</strong>
                  <p className="text-primary/70">{data.languages}</p>
                </div>
              </div>
              
              <div>
                <strong className="text-primary block mb-1">Professional Bio:</strong>
                <p className="text-primary/70 whitespace-pre-wrap">{data.bio}</p>
              </div>

              <div>
                <strong className="text-primary block mb-1">Teaching Experience:</strong>
                <p className="text-primary/70 whitespace-pre-wrap">{data.experience}</p>
              </div>

              <div>
                <strong className="text-primary block mb-1">Qualifications:</strong>
                <p className="text-primary/70">{data.qualifications}</p>
              </div>

              <div className="pt-4 border-t border-secondary/50">
                <strong className="text-primary block mb-3">Teaching Preferences:</strong>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-bold text-primary/60 uppercase">Student Levels:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {data.teachingLevels.length > 0 ? data.teachingLevels.map(s => (
                        <span key={s} className="px-2 py-1 bg-secondary text-primary rounded-md text-xs font-bold">{s}</span>
                      )) : <span className="text-primary/50 italic">None selected</span>}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary/60 uppercase">Age Groups:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {data.teachingAges.length > 0 ? data.teachingAges.map(s => (
                        <span key={s} className="px-2 py-1 bg-secondary text-primary rounded-md text-xs font-bold">{s}</span>
                      )) : <span className="text-primary/50 italic">None selected</span>}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary/60 uppercase">Styles & Focus:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {data.teachingStyle.length > 0 ? data.teachingStyle.map(s => (
                        <span key={s} className="px-2 py-1 bg-accent/10 text-accent rounded-md text-xs font-bold">{s}</span>
                      )) : <span className="text-primary/50 italic">None selected</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-secondary/50">
                <strong className="text-primary block mb-1">Calendly Link:</strong>
                {data.calendlyUrl ? (
                  <a href={data.calendlyUrl} target="_blank" rel="noreferrer" className="text-[#006BFF] hover:underline break-all">{data.calendlyUrl}</a>
                ) : (
                  <p className="text-primary/50 italic">Not provided</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION CONTROLS */}
      <div className="mt-12 flex items-center justify-between pt-6 border-t border-secondary/50">
        {step > 1 ? (
          <button 
            type="button" 
            onClick={() => setStep(prev => prev - 1)}
            disabled={status !== 'idle'}
            className="flex items-center gap-2 px-6 py-3 text-primary/60 hover:text-primary font-bold text-sm tracking-widest uppercase transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
        ) : (
          <div></div> // Empty div for flex spacing
        )}
        
        {step < totalSteps ? (
          <button 
            type="button" 
            onClick={handleNext}
            disabled={status !== 'idle'}
            className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-accent text-white font-bold text-sm tracking-widest uppercase rounded-xl shadow-md transition-colors disabled:opacity-70"
          >
            {status === 'saving' ? 'Saving...' : 'Next'} <ArrowRight size={16} />
          </button>
        ) : (
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={status !== 'idle'}
            className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-primary text-white font-bold text-sm tracking-widest uppercase rounded-xl shadow-md transition-colors disabled:opacity-70"
          >
            {status === 'submitting' ? 'Submitting...' : 'Submit Profile'} <CheckCircle2 size={16} />
          </button>
        )}
      </div>

    </div>
  );
}
