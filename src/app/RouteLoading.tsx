const RouteLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 bg-braini-blue rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
        <span className="text-white text-xl">🧠</span>
      </div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  </div>
);

export default RouteLoading;
