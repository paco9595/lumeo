import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-purple-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Acceso No Autorizado
                        </h1>
                        <p className="text-gray-600">
                            No tienes permisos para acceder a esta página.
                        </p>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                            Esta página está restringida a usuarios con roles específicos.
                            Si crees que deberías tener acceso, contacta al administrador.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Volver al Inicio
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full bg-white text-gray-700 py-3 px-6 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
                        >
                            Contactar Soporte
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
