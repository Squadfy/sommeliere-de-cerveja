export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-heineken-green rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl font-bold">S</span>
        </div>
        <h1 className="text-3xl font-bold text-heineken-green mb-2">
          Sommelière de Cerveja
        </h1>
        <p className="text-gray-600 mb-8">
          Descubra a combinação perfeita entre seu prato e a cerveja ideal.
        </p>
        <div className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-heineken-green/10 text-heineken-green border border-heineken-green/20">
          Em desenvolvimento
        </div>
      </div>
    </main>
  )
}
