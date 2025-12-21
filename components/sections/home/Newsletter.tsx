export function Newsletter() {
  return (
    <section className="border-y border-gray-200 bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <span className="mb-6 inline-block border border-gray-900 bg-gray-900 px-6 py-2 text-sm font-bold uppercase tracking-wider text-white">
          Newsletter Zona Street
        </span>
        <h2 className="mb-4 text-4xl font-black uppercase text-gray-900 md:text-6xl">
          10% OFF
        </h2>
        <p className="mb-8 text-lg font-medium text-gray-600 md:text-xl">
          Cadastre-se e receba vantagens exclusivas
        </p>
        <div className="mb-10 grid gap-4 text-left sm:grid-cols-3">
          <div className="border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-900">
              10% OFF
            </h3>
            <p className="text-sm font-medium text-gray-600">
              Na sua primeira compra
            </p>
          </div>
          <div className="border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-900">
              Acesso VIP
            </h3>
            <p className="text-sm font-medium text-gray-600">
              Aos lançamentos antes de todos
            </p>
          </div>
          <div className="border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-900">
              Promos Exclusivas
            </h3>
            <p className="text-sm font-medium text-gray-600">
              Ofertas só para assinantes
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <input
            type="email"
            placeholder="Digite seu melhor e-mail"
            className="border border-gray-300 bg-white px-8 py-4 text-base font-medium text-gray-900 focus:border-gray-900 focus:outline-none"
          />
          <button className="border-2 border-gray-900 bg-gray-900 px-10 py-4 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-orange-600 hover:border-orange-600">
            Cadastrar
          </button>
        </div>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-500">
          Seus dados estão seguros conosco
        </p>
      </div>
    </section>
  );
}
