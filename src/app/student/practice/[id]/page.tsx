import { ArrowLeft, BookOpen, MessageSquare, Mic, Volume2 } from "lucide-react";
import Link from "next/link";
import VoiceRecorder from "@/components/practice/VoiceRecorder";

// Dummy content database for exercises
const exercisesDB = {
  "conversational-1": {
    title: "Ordering at a Restaurant",
    category: "Conversational Scenarios",
    icon: MessageSquare,
    color: "text-blue-600 bg-blue-100",
    content: (
      <div className="space-y-6 text-primary/80 font-sans leading-relaxed">
        <p><strong>Instructions:</strong> Read the customer's lines aloud as if you were speaking to a real waiter. Focus on a polite, natural tone.</p>
        <div className="bg-white p-6 rounded-2xl border border-secondary/20 shadow-sm space-y-4">
          <p className="text-sm text-primary/50 italic">Waiter: "Hi there! Are you ready to order?"</p>
          <p className="font-bold text-primary pl-4 border-l-2 border-accent">Customer: "Yes, I think so. I'll have the grilled salmon, please."</p>
          <p className="text-sm text-primary/50 italic">Waiter: "Excellent choice. Would you like a side salad or fries with that?"</p>
          <p className="font-bold text-primary pl-4 border-l-2 border-accent">Customer: "I'll go with the side salad. And could I get the dressing on the side?"</p>
          <p className="text-sm text-primary/50 italic">Waiter: "Of course. Can I get you anything to drink?"</p>
          <p className="font-bold text-primary pl-4 border-l-2 border-accent">Customer: "Just a glass of iced tea, thank you."</p>
        </div>
      </div>
    )
  },
  "ielts-1": {
    title: "Describing a Hometown",
    category: "IELTS Speaking",
    icon: Mic,
    color: "text-accent bg-accent/10",
    content: (
      <div className="space-y-6 text-primary/80 font-sans leading-relaxed">
        <p><strong>Instructions:</strong> You have 1 minute to prepare, and 2 minutes to speak. Read the prompt below and record your response.</p>
        <div className="bg-white p-6 rounded-2xl border border-secondary/20 shadow-sm space-y-4">
          <h4 className="font-bold text-primary uppercase tracking-widest text-xs">Part 2 Prompt</h4>
          <p className="font-bold text-lg font-playfair">Describe your hometown.</p>
          <p>You should say:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Where it is located</li>
            <li>What it is known for</li>
            <li>What you like best about it</li>
          </ul>
          <p>...and explain whether you would recommend it to a tourist.</p>
        </div>
      </div>
    )
  },
  "read-aloud-1": {
    title: "The Tech Revolution",
    category: "Fluency & Read-Aloud",
    icon: BookOpen,
    color: "text-purple-600 bg-purple-100",
    content: (
      <div className="space-y-6 text-primary/80 font-sans leading-relaxed">
        <p><strong>Instructions:</strong> Read the following passage at a steady, natural pace. Pay attention to pausing at commas and full stops.</p>
        <div className="bg-white p-8 rounded-2xl border border-secondary/20 shadow-sm">
          <p className="text-lg leading-loose">
            In recent years, the rapid advancement of technology has fundamentally transformed how we communicate. 
            Smartphones, which were once considered a luxury, are now an indispensable part of daily life. 
            They allow us to stay connected with friends and family across the globe instantly. 
            However, some experts argue that this constant connectivity might actually be making us more isolated, 
            as face-to-face interactions are increasingly replaced by screen time.
          </p>
        </div>
      </div>
    )
  },
  "vocabulary-1": {
    title: "Business English Idioms",
    category: "Vocabulary Drills",
    icon: Volume2,
    color: "text-orange-600 bg-orange-100",
    content: (
      <div className="space-y-6 text-primary/80 font-sans leading-relaxed">
        <p><strong>Instructions:</strong> Review the idioms below. Then, record yourself inventing a sentence for each one to practice using them in context.</p>
        <div className="bg-white p-6 rounded-2xl border border-secondary/20 shadow-sm space-y-6">
          <div>
            <h4 className="font-bold text-primary">1. Get the ball rolling</h4>
            <p className="text-sm text-primary/60">Meaning: To start something.</p>
          </div>
          <div>
            <h4 className="font-bold text-primary">2. Touch base</h4>
            <p className="text-sm text-primary/60">Meaning: To briefly make or renew contact with someone.</p>
          </div>
          <div>
            <h4 className="font-bold text-primary">3. On the same page</h4>
            <p className="text-sm text-primary/60">Meaning: Having the same understanding or thinking the same way.</p>
          </div>
        </div>
      </div>
    )
  }
};

export default async function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exercise = exercisesDB[id as keyof typeof exercisesDB];

  if (!exercise) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-black text-primary font-playfair mb-4">Exercise not found</h1>
        <Link href="/student/practice" className="text-accent hover:underline font-bold">Return to Practice Hub</Link>
      </div>
    );
  }

  const Icon = exercise.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans pb-20">
      
      {/* Back Button */}
      <Link href="/student/practice" className="inline-flex items-center gap-2 text-sm font-bold text-primary/50 hover:text-accent transition-colors uppercase tracking-widest">
        <ArrowLeft size={16} /> Back to Hub
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-secondary/30 p-8 md:p-12 rounded-3xl shadow-sm relative overflow-hidden">
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${exercise.color} shadow-sm`}>
                <Icon size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/50 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                {exercise.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-primary font-playfair mb-8 relative z-10">{exercise.title}</h1>
            
            <div className="relative z-10">
              {exercise.content}
            </div>

          </div>
        </div>

        {/* Right Column: Recorder & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm sticky top-32">
            <h3 className="text-xl font-black text-primary font-playfair mb-2">Practice Tools</h3>
            <p className="text-sm text-primary/60 font-sans mb-6">Record your voice to self-evaluate your pronunciation and fluency.</p>
            
            <VoiceRecorder />

            <div className="mt-8 pt-8 border-t border-secondary/20">
              <button className="w-full px-6 py-4 bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-wider text-sm transition-all rounded-2xl shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1">
                Mark as Completed
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
