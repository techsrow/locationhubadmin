export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-10">
        Overview
      </h1>

      <div className="grid grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700">
            Bride Gallery
          </h2>
          <p className="text-gray-500 mt-3">
            Upload, reorder and manage bride images.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700">
            Groom Gallery
          </h2>
          <p className="text-gray-500 mt-3">
            Manage groom gallery images.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700">
            System Status
          </h2>
          <p className="text-gray-500 mt-3">
            Backend connected and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
