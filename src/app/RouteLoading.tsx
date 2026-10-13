import { Component, type ReactNode } from "react";

const RouteLoading = () => (
  <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 bg-braini-blue rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
        <span className="text-white text-xl">🧠</span>
      </div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  </div>
);

type RouteChunkErrorBoundaryProps = {
  children: ReactNode;
};

type RouteChunkErrorBoundaryState = {
  hasError: boolean;
};

export class RouteChunkErrorBoundary extends Component<
  RouteChunkErrorBoundaryProps,
  RouteChunkErrorBoundaryState
> {
  state: RouteChunkErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RouteChunkErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-linear-to-br from-braini-blue/10 via-white to-braini-turquoise/10 flex items-center justify-center p-6">
          <div className="text-center max-w-md space-y-3">
            <p className="text-gray-900 font-semibold">No se pudo cargar esta vista</p>
            <p className="text-sm text-gray-600">
              Suele ocurrir cuando Vite regenera dependencias. Recarga la página.
            </p>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-braini-blue px-4 py-2 text-sm font-medium text-white hover:bg-braini-blue-dark"
              onClick={() => window.location.reload()}
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default RouteLoading;
