import { MessageSquare, Mic, BookOpen, Volume2, Play, Star } from "lucide-react";
import Link from "next/link";

export default function StudentPracticePage() {
  const exercises = [
    {
      id: "conversational-1",
      category: "Conversational Scenarios",
      title: "Ordering at a Restaurant",
      description: "Practice real-world English by roleplaying a conversation at a cafe.",
      icon: MessageSquare,
      color: "bg-blue-100 text-blue-600",
      duration: "5 mins",
      difficulty: "Beginner"
    },
    {
      id: "ielts-1",
      category: "IELTS Speaking",
      title: "Describing a Hometown",
      description: "A standard 2-minute speaking prompt to practice your fluency and vocabulary.",
      icon: Mic,
      color: "bg-accent/10 text-accent",
      duration: "10 mins",
      difficulty: "Intermediate"
    },
    {
      id: "read-aloud-1",
      category: "Fluency & Read-Aloud",
      title: "The Tech Revolution",
      description: "Read a short article aloud to practice pacing, pausing, and pronunciation.",
      icon: BookOpen,
      color: "bg-purple-100 text-purple-600",
      duration: "8 mins",
      difficulty: "Advanced"
    },
    {
      id: "vocabulary-1",
      category: "Vocabulary Drills",
      title: "Business English Idioms",
      description: "Learn and use 5 common business idioms in your own spoken sentences.",
      icon: Volume2,
      color: "bg-orange-100 text-orange-600",
      duration: "10 mins",
      difficulty: "Intermediate"
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-8 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-sm font-sans bg-accent/10 px-3 py-1 rounded-full w-fit flex items-center gap-2">
            <Star size={14} /> Practice Hub
          </h4>
          <h1 className="text-4xl sm:text-5xl font-black text-primary tracking-tight font-playfair">English Speaking Practice</h1>
          <p className="text-primary/70 mt-3 font-sans text-lg max-w-xl">Self-guided exercises to strengthen your English fluency, vocabulary, and confidence.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {exercises.map((exercise) => {
          const Icon = exercise.icon;
          return (
            <Link href={`/student/practice/${exercise.id}`} key={exercise.id} className="bg-white border border-secondary/20 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:rotate-12">
                <Icon size={120} />
              </div>
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${exercise.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/50 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                    {exercise.category}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-primary font-playfair mb-3">{exercise.title}</h3>
                <p className="text-primary/60 font-sans text-sm leading-relaxed mb-8 max-w-sm">{exercise.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-secondary/20 pt-6 mt-auto">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-primary/70 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> {exercise.duration}
                  </span>
                  <span className="text-xs font-bold text-primary/70 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span> {exercise.difficulty}
                  </span>
                </div>
                
                <button className="w-10 h-10 bg-secondary/10 group-hover:bg-accent text-primary group-hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                  <Play size={16} className="ml-1" />
                </button>
              </div>
            </Link>
          )
        })}
      </div>

    </div>
  );
}
