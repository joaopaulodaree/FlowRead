import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-5xl font-bold tracking-tight">TextReader</h1>
      <p className="text-lg text-gray-500 max-w-md text-center">
        A fluid article reader built for long-form reading, powered by Pretext.
      </p>
      <Link
        href="/articles"
        className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        Browse Articles
      </Link>
    </div>
  )
}
