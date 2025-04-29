import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold text-white">TaskLoop</h1>
      <Link 
        href="/session/create"
        className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Start Session
      </Link>
    </div>
  );
}
