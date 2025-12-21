export function Promotions() {
  return (
    <section className="border-y border-gray-200 bg-gray-50 py-3">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-center text-xs font-medium uppercase tracking-wide text-gray-700 md:gap-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900">•</span>
            <span>10% OFF no PIX</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900">•</span>
            <span>Frete Grátis +R$299</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900">•</span>
            <span>Primeira Troca Grátis</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900">•</span>
            <span>Parcelamento em 10x</span>
          </div>
        </div>
      </div>
    </section>
  );
}
